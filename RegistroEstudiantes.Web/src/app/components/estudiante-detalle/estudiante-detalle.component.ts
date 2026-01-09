import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Estudiante } from '../../models/estudiante.model';
import { CompanerosPorMateria } from '../../models/materia.model';
import { AppError } from '../../interceptors/error.interceptor';

@Component({
  selector: 'app-estudiante-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estudiante-detalle.component.html',
  styleUrls: ['./estudiante-detalle.component.scss']
})
export class EstudianteDetalleComponent implements OnInit {
  estudiante: Estudiante | null = null;
  companeros: CompanerosPorMateria[] = [];
  loading = true;
  loadingCompaneros = false;
  error = '';
  estudianteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id && !isNaN(id)) {
        this.estudianteId = id;
        this.cargarDatos(id);
      } else {
        this.error = 'ID de estudiante inválido';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarDatos(id: number): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    this.cargarEstudiante(id);
    this.cargarCompaneros(id);
  }

  cargarEstudiante(id: number): void {
    this.apiService.getEstudiante(id).subscribe({
      next: (data) => {
        console.log('Estudiante cargado:', data);
        this.estudiante = data;
        this.verificarLoading();
        this.cdr.detectChanges();
      },
      error: (err: AppError) => {
        console.error('Error cargando estudiante:', err);
        this.error = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarCompaneros(id: number): void {
    this.loadingCompaneros = true;
    this.apiService.getCompaneros(id).subscribe({
      next: (data) => {
        console.log('Compañeros cargados:', data);
        this.companeros = data;
        this.loadingCompaneros = false;
        this.verificarLoading();
        this.cdr.detectChanges();
      },
      error: (err: AppError) => {
        console.error('Error cargando compañeros:', err);
        this.error = err.message;
        this.loadingCompaneros = false;
        this.verificarLoading();
        this.cdr.detectChanges();
      }
    });
  }

  private verificarLoading(): void {
    if (!this.loadingCompaneros && this.estudiante !== null) {
      this.loading = false;
    }
  }

  recargar(): void {
    if (this.estudianteId) {
      this.loading = true;
      this.error = '';
      this.companeros = [];
      this.estudiante = null;
      this.cdr.detectChanges();
      this.cargarDatos(this.estudianteId);
    }
  }
}
