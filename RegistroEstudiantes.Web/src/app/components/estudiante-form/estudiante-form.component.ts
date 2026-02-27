import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Materia, Profesor } from '../../models/materia.model';
import { ActualizarEstudiante, CrearEstudiante } from '../../models/estudiante.model';
import { AppError } from '../../interceptors/error.interceptor';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './estudiante-form.component.html',
  styleUrls: ['./estudiante-form.component.scss']
})
export class EstudianteFormComponent implements OnInit {
  estudianteForm!: FormGroup;
  profesores: Profesor[] = [];
  loading = true;
  submitting = false;
  error = '';
  success = '';
  isEditMode = false;
  estudianteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.detectarModoEdicion();
    this.cargarProfesores();
  }

  private detectarModoEdicion(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id && !Number.isNaN(id)) {
      this.isEditMode = true;
      this.estudianteId = id;
    }
  }

  private initializeForm(): void {
    this.estudianteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      materiasIds: [[], [Validators.required, this.exactlyThreeMateriasValidator.bind(this)]]
    });
  }

  get f() {
    return this.estudianteForm.controls;
  }

  get materiasSeleccionadas(): number[] {
    return this.estudianteForm.get('materiasIds')?.value || [];
  }

  private exactlyThreeMateriasValidator(control: AbstractControl): ValidationErrors | null {
    const materias = control.value as number[];
    if (!materias || materias.length !== 3) {
      return { exactlyThree: { required: 3, actual: materias?.length || 0 } };
    }
    return null;
  }

  private differentProfessorsValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const materias = control.value as number[];
      if (!materias || materias.length === 0) {
        return null;
      }

      if (!this.profesores || this.profesores.length === 0) {
        return null;
      }

      const profesoresUsados = new Set<number>();

      for (const materiaId of materias) {
        const profesor = this.profesores.find(p =>
          p.materias?.some(m => m.id === materiaId)
        );

        if (profesor) {
          if (profesoresUsados.has(profesor.id)) {
            return { sameProfessor: true };
          }
          profesoresUsados.add(profesor.id);
        }
      }
      return null;
    };
  }

  cargarProfesores(): void {
    this.loading = true;
    this.error = '';
    this.apiService.getProfesores().subscribe({
      next: (data) => {
        console.log('Profesores cargados:', data);
        this.profesores = data;
        this.loading = false;

        this.actualizarValidadores();
        if (this.isEditMode && this.estudianteId) {
          this.cargarEstudianteEdicion(this.estudianteId);
        }
        this.cdr.detectChanges();
      },
      error: (err: AppError) => {
        console.error('Error cargando profesores:', err);
        this.error = err.message || 'Error al cargar profesores';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private cargarEstudianteEdicion(id: number): void {
    this.submitting = true;
    this.apiService.getEstudiante(id).subscribe({
      next: (estudiante) => {
        this.estudianteForm.patchValue({
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          email: estudiante.email,
          materiasIds: estudiante.materias.map(m => m.id)
        });
        this.submitting = false;
        this.cdr.detectChanges();
      },
      error: (err: AppError) => {
        this.error = err.message || 'Error al cargar estudiante';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  private actualizarValidadores(): void {
    const materiasControl = this.estudianteForm.get('materiasIds');
    if (materiasControl) {
      materiasControl.setValidators([
        Validators.required,
        this.exactlyThreeMateriasValidator.bind(this),
        this.differentProfessorsValidator().bind(this)
      ]);
      materiasControl.updateValueAndValidity();
    }
  }

  toggleMateria(materiaId: number): void {
    const materias = [...this.materiasSeleccionadas];
    const index = materias.indexOf(materiaId);

    if (index > -1) {
      materias.splice(index, 1);
    } else {
      if (materias.length < 3) {
        const materiaCheck = this.profesores
          .flatMap(p => p.materias || [])
          .find(m => m.id === materiaId);

        if (materiaCheck) {
          const profesorCheck = this.profesores.find(p => p.id === materiaCheck.profesorId);
          const profesorYaUsado = this.profesores.some(p =>
            p.id === materiaCheck.profesorId &&
            p.materias?.some(m => materias.includes(m.id))
          );

          if (!profesorYaUsado) {
            materias.push(materiaId);
          }
        }
      }
    }

    this.estudianteForm.patchValue({ materiasIds: materias });
    this.estudianteForm.get('materiasIds')?.updateValueAndValidity();
  }

  isMateriaSeleccionada(materiaId: number): boolean {
    return this.materiasSeleccionadas.includes(materiaId);
  }

  isProfesorUsado(materiaIdToCheck?: number): boolean {
    if (!materiaIdToCheck) return false;

    const materiaCheck = this.profesores
      .flatMap(p => p.materias || [])
      .find(m => m.id === materiaIdToCheck);

    if (!materiaCheck) return false;

    return this.profesores.some(p =>
      p.id === materiaCheck.profesorId &&
      p.materias?.some(m => this.materiasSeleccionadas.includes(m.id))
    );
  }

  isMateriaDisabled(materia: Materia): boolean {
    if (this.isMateriaSeleccionada(materia.id)) return false;
    if (this.materiasSeleccionadas.length >= 3) return true;
    return this.isProfesorUsado(materia.id);
  }

  onSubmit(): void {
    console.log('=== INICIO onSubmit ===');
    console.log('submitting antes:', this.submitting);

    this.error = '';
    this.success = '';

    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
      control?.markAsTouched();
    });

    if (this.estudianteForm.invalid) {
      const nombreErrors = this.f['nombre'].errors;
      const apellidoErrors = this.f['apellido'].errors;
      const emailErrors = this.f['email'].errors;
      const materiasErrors = this.f['materiasIds'].errors;

      if (nombreErrors) {
        if (nombreErrors['required']) this.error = 'El nombre es requerido';
        else if (nombreErrors['minlength']) this.error = 'El nombre debe tener al menos 3 caracteres';
        else if (nombreErrors['maxlength']) this.error = 'El nombre no puede exceder 100 caracteres';
      } else if (apellidoErrors) {
        if (apellidoErrors['required']) this.error = 'El apellido es requerido';
        else if (apellidoErrors['minlength']) this.error = 'El apellido debe tener al menos 3 caracteres';
        else if (apellidoErrors['maxlength']) this.error = 'El apellido no puede exceder 100 caracteres';
      } else if (emailErrors) {
        if (emailErrors['required']) this.error = 'El email es requerido';
        else if (emailErrors['email']) this.error = 'Email invÃ¡lido';
        else if (emailErrors['maxlength']) this.error = 'El email no puede exceder 255 caracteres';
      } else if (materiasErrors) {
        if (materiasErrors['required']) this.error = 'Debe seleccionar materias';
        else if (materiasErrors['exactlyThree']) this.error = `Debe seleccionar exactamente 3 materias (seleccionadas: ${materiasErrors['exactlyThree'].actual})`;
        else if (materiasErrors['sameProfessor']) this.error = 'No puede seleccionar materias del mismo profesor';
      } else {
        this.error = 'Por favor complete todos los campos correctamente';
      }

      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    const estudiante: CrearEstudiante = this.estudianteForm.value;

    if (this.isEditMode && this.estudianteId) {
      this.apiService.actualizarEstudiante(this.estudianteId, estudiante as ActualizarEstudiante).subscribe({
        next: () => {
          this.success = 'Estudiante actualizado exitosamente';
          this.submitting = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (err: AppError) => {
          console.error('ERROR - Error actualizando estudiante:', err);
          this.submitting = false;
          this.error = err.message;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.apiService.crearEstudiante(estudiante).subscribe({
      next: () => {
        this.success = 'Estudiante registrado exitosamente';
        this.submitting = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err: AppError) => {
        console.error('ERROR - Error creando estudiante:', err);
        this.submitting = false;
        this.error = err.message;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.estudianteForm.reset();
    this.error = '';
    this.success = '';
    this.cdr.detectChanges();
  }
}
