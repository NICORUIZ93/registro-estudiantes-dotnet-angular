import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Estudiante } from '../../models/estudiante.model';
import { AppError } from '../../interceptors/error.interceptor';

@Component({
  selector: 'app-estudiantes-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estudiantes-lista.component.html',
  styleUrls: ['./estudiantes-lista.component.scss']
})
export class EstudiantesListaComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = true;
  error = '';
  successMessage = '';
  estudianteAEliminar: number | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.apiService.getEstudiantes().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio:', data);
        this.estudiantes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: AppError) => {
        console.error('Error completo:', err);
        this.error = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  mostrarModalEliminar(id: number): void {
    this.estudianteAEliminar = id;
    const modalElement = document.getElementById('confirmDeleteModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmarEliminacion(): void {
    if (this.estudianteAEliminar !== null) {
      this.apiService.eliminarEstudiante(this.estudianteAEliminar).subscribe({
        next: () => {
          this.successMessage = 'Estudiante eliminado exitosamente';
          this.estudianteAEliminar = null;

          const modalElement = document.getElementById('confirmDeleteModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }

          this.cargarEstudiantes();

          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err: AppError) => {
          this.error = err.message;
          console.error(err);
          this.estudianteAEliminar = null;

          const modalElement = document.getElementById('confirmDeleteModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }

          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelarEliminacion(): void {
    this.estudianteAEliminar = null;
  }
}
