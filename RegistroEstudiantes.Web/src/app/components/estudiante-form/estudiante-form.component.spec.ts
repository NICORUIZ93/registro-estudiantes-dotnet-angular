import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { EstudianteFormComponent } from './estudiante-form.component';
import { ApiService } from '../../services/api.service';
import { Profesor } from '../../models/materia.model';
import { Estudiante } from '../../models/estudiante.model';

describe('EstudianteFormComponent', () => {
  let component: EstudianteFormComponent;
  let fixture: ComponentFixture<EstudianteFormComponent>;
  let apiService: ApiService;

  const mockProfesores: Profesor[] = [
    {
      id: 1,
      nombre: 'John',
      apellido: 'Smith',
      materias: [
        { id: 1, nombre: 'Matemáticas I', creditos: 3, profesorId: 1, profesorNombre: 'John Smith' },
        { id: 2, nombre: 'Álgebra', creditos: 4, profesorId: 1, profesorNombre: 'John Smith' }
      ]
    },
    {
      id: 2,
      nombre: 'Jane',
      apellido: 'Doe',
      materias: [
        { id: 3, nombre: 'Física I', creditos: 3, profesorId: 2, profesorNombre: 'Jane Doe' },
        { id: 4, nombre: 'Mecánica', creditos: 4, profesorId: 2, profesorNombre: 'Jane Doe' }
      ]
    },
    {
      id: 3,
      nombre: 'Bob',
      apellido: 'Johnson',
      materias: [
        { id: 5, nombre: 'Química', creditos: 3, profesorId: 3, profesorNombre: 'Bob Johnson' }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteFormComponent],
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteFormComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.estudianteForm).toBeDefined();
      expect(component.estudianteForm.get('nombre')?.value).toBe('');
      expect(component.estudianteForm.get('apellido')?.value).toBe('');
      expect(component.estudianteForm.get('email')?.value).toBe('');
      expect(component.estudianteForm.get('materiasIds')?.value).toEqual([]);
    });

    it('should have required validators', () => {
      const form = component.estudianteForm;

      expect(form.get('nombre')?.hasError('required')).toBe(true);
      expect(form.get('apellido')?.hasError('required')).toBe(true);
      expect(form.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.estudianteForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('should validate minimum length for nombre', () => {
      const nombreControl = component.estudianteForm.get('nombre');

      nombreControl?.setValue('ab');
      expect(nombreControl?.hasError('minlength')).toBe(true);

      nombreControl?.setValue('abc');
      expect(nombreControl?.hasError('minlength')).toBe(false);
    });
  });

  describe('cargarProfesores', () => {
    it('should load profesores successfully', () => {
      vi.spyOn(apiService, 'getProfesores').mockReturnValue(of(mockProfesores));

      component.cargarProfesores();

      expect(apiService.getProfesores).toHaveBeenCalled();
      expect(component.profesores).toEqual(mockProfesores);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('');
    });

    it('should handle error when loading profesores', () => {
      vi.spyOn(apiService, 'getProfesores').mockReturnValue(
        throwError(() => new Error('Error de conexión'))
      );
      vi.spyOn(console, 'error');

      component.cargarProfesores();

      expect(component.error).toBe('Error al cargar profesores y materias');
      expect(component.loading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Custom validators', () => {
    beforeEach(() => {
      component.profesores = mockProfesores;
    });

    it('should validate exactly three materias', () => {
      const materiasControl = component.estudianteForm.get('materiasIds');

      materiasControl?.setValue([1, 2]);
      expect(materiasControl?.hasError('exactlyThree')).toBe(true);

      materiasControl?.setValue([1, 2, 3]);
      expect(materiasControl?.hasError('exactlyThree')).toBe(false);

      materiasControl?.setValue([1, 2, 3, 4]);
      expect(materiasControl?.hasError('exactlyThree')).toBe(true);
    });

    it('should validate different professors', () => {
      const materiasControl = component.estudianteForm.get('materiasIds');

      materiasControl?.setValue([1, 2, 3]);
      expect(materiasControl?.hasError('sameProfessor')).toBe(true);

      materiasControl?.setValue([1, 3, 5]);
      expect(materiasControl?.hasError('sameProfessor')).toBe(false);
    });
  });

  describe('toggleMateria', () => {
    beforeEach(() => {
      component.profesores = mockProfesores;
    });

    it('should add materia when not selected', () => {
      component.toggleMateria(1);

      expect(component.materiasSeleccionadas).toContain(1);
      expect(component.materiasSeleccionadas.length).toBe(1);
    });

    it('should remove materia when already selected', () => {
      component.estudianteForm.patchValue({ materiasIds: [1, 3, 5] });

      component.toggleMateria(1);

      expect(component.materiasSeleccionadas).not.toContain(1);
      expect(component.materiasSeleccionadas.length).toBe(2);
    });

    it('should not add more than 3 materias', () => {
      component.estudianteForm.patchValue({ materiasIds: [1, 3, 5] });

      component.toggleMateria(4);

      expect(component.materiasSeleccionadas.length).toBe(3);
      expect(component.materiasSeleccionadas).not.toContain(4);
    });

    it('should not add materia from same professor', () => {
      component.estudianteForm.patchValue({ materiasIds: [1] });

      component.toggleMateria(2);

      expect(component.materiasSeleccionadas).not.toContain(2);
      expect(component.materiasSeleccionadas.length).toBe(1);
    });
  });

  describe('isMateriaSeleccionada', () => {
    it('should return true if materia is selected', () => {
      component.estudianteForm.patchValue({ materiasIds: [1, 3, 5] });

      expect(component.isMateriaSeleccionada(1)).toBe(true);
      expect(component.isMateriaSeleccionada(3)).toBe(true);
      expect(component.isMateriaSeleccionada(2)).toBe(false);
    });
  });

  describe('isProfesorUsado', () => {
    beforeEach(() => {
      component.profesores = mockProfesores;
    });

    it('should return true if profesor has selected materia', () => {
      component.estudianteForm.patchValue({ materiasIds: [1] });

      expect(component.isProfesorUsado(2)).toBe(true);
    });

    it('should return false if profesor has no selected materias', () => {
      component.estudianteForm.patchValue({ materiasIds: [3] });

      expect(component.isProfesorUsado(1)).toBe(false);
    });
  });

  describe('isMateriaDisabled', () => {
    beforeEach(() => {
      component.profesores = mockProfesores;
    });

    it('should not disable selected materia', () => {
      component.estudianteForm.patchValue({ materiasIds: [1] });
      const materia = mockProfesores[0].materias[0];

      expect(component.isMateriaDisabled(materia)).toBe(false);
    });

    it('should disable when 3 materias are selected', () => {
      component.estudianteForm.patchValue({ materiasIds: [1, 3, 5] });
      const materia = mockProfesores[1].materias[1];

      expect(component.isMateriaDisabled(materia)).toBe(true);
    });

    it('should disable materia from same professor', () => {
      component.estudianteForm.patchValue({ materiasIds: [1] });
      const materia = mockProfesores[0].materias[1];

      expect(component.isMateriaDisabled(materia)).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.profesores = mockProfesores;
    });

    it('should not submit invalid form', () => {
      vi.spyOn(apiService, 'crearEstudiante');

      component.onSubmit();

      expect(apiService.crearEstudiante).not.toHaveBeenCalled();
      expect(component.error).toBeTruthy();
    });

    it('should show error for invalid nombre', () => {
      component.estudianteForm.patchValue({
        nombre: 'ab',
        apellido: 'Valid',
        email: 'valid@email.com',
        materiasIds: [1, 3, 5]
      });

      component.onSubmit();

      expect(component.error).toContain('nombre');
    });

    it('should show error for invalid email', () => {
      component.estudianteForm.patchValue({
        nombre: 'Valid',
        apellido: 'Valid',
        email: 'invalid-email',
        materiasIds: [1, 3, 5]
      });

      component.onSubmit();

      expect(component.error).toContain('Email');
    });

    it('should show error for not exactly 3 materias', () => {
      component.estudianteForm.patchValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        materiasIds: [1, 3]
      });

      component.onSubmit();

      expect(component.error).toContain('3 materias');
    });

    it('should submit valid form successfully', () => {
      const mockResponse: Estudiante = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        totalCreditos: 9,
        materias: [],
        createdAt: new Date()
      };

      vi.spyOn(apiService, 'crearEstudiante').mockReturnValue(of(mockResponse));

      component.estudianteForm.patchValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        materiasIds: [1, 3, 5]
      });

      component.onSubmit();

      expect(apiService.crearEstudiante).toHaveBeenCalled();
      expect(component.success).toBe('Estudiante registrado exitosamente');
      expect(component.submitting).toBe(true);
    });

    it('should handle error when submitting', () => {
      vi.spyOn(apiService, 'crearEstudiante').mockReturnValue(
        throwError(() => ({ error: { message: 'Email ya existe' } }))
      );
      vi.spyOn(console, 'error');

      component.estudianteForm.patchValue({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        materiasIds: [1, 3, 5]
      });

      component.onSubmit();

      expect(component.error).toContain('Email ya existe');
      expect(component.submitting).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Getters', () => {
    it('should return form controls', () => {
      const controls = component.f;

      expect(controls['nombre']).toBeDefined();
      expect(controls['apellido']).toBeDefined();
      expect(controls['email']).toBeDefined();
      expect(controls['materiasIds']).toBeDefined();
    });

    it('should return selected materias', () => {
      component.estudianteForm.patchValue({ materiasIds: [1, 3, 5] });

      expect(component.materiasSeleccionadas).toEqual([1, 3, 5]);
    });
  });
});
