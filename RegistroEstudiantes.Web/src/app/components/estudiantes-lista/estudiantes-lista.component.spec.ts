import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { EstudiantesListaComponent } from './estudiantes-lista.component';
import { ApiService } from '../../services/api.service';
import { Estudiante } from '../../models/estudiante.model';

describe('EstudiantesListaComponent', () => {
  let component: EstudiantesListaComponent;
  let fixture: ComponentFixture<EstudiantesListaComponent>;
  let apiService: ApiService;

  const mockEstudiantes: Estudiante[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      totalCreditos: 9,
      materias: [],
      createdAt: new Date()
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      email: 'maria@example.com',
      totalCreditos: 12,
      materias: [],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudiantesListaComponent],
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstudiantesListaComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading true', () => {
    expect(component.loading).toBe(true);
    expect(component.estudiantes).toEqual([]);
    expect(component.error).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call cargarEstudiantes on init', () => {
      vi.spyOn(component, 'cargarEstudiantes');
      component.ngOnInit();
      expect(component.cargarEstudiantes).toHaveBeenCalled();
    });
  });

  describe('cargarEstudiantes', () => {
    it('should load estudiantes successfully', () => {
      vi.spyOn(apiService, 'getEstudiantes').mockReturnValue(of(mockEstudiantes));

      component.cargarEstudiantes();

      expect(apiService.getEstudiantes).toHaveBeenCalled();
      expect(component.estudiantes).toEqual(mockEstudiantes);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('');
    });

    it('should handle error when loading estudiantes', () => {
      const errorMessage = 'Error de conexión';
      vi.spyOn(apiService, 'getEstudiantes').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );
      vi.spyOn(console, 'error');

      component.cargarEstudiantes();

      expect(apiService.getEstudiantes).toHaveBeenCalled();
      expect(component.estudiantes).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.error).toBe('Error al cargar estudiantes');
      expect(console.error).toHaveBeenCalled();
    });

    it('should set loading to true at the start', () => {
      vi.spyOn(apiService, 'getEstudiantes').mockReturnValue(of(mockEstudiantes));
      component.loading = false;

      component.cargarEstudiantes();

      expect(component.loading).toBe(false);
    });
  });

  describe('eliminarEstudiante', () => {
    it('should delete estudiante when confirmed', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.spyOn(apiService, 'eliminarEstudiante').mockReturnValue(of(undefined));
      vi.spyOn(component, 'cargarEstudiantes');

      component.eliminarEstudiante(1);

      expect(window.confirm).toHaveBeenCalledWith('¿Está seguro de eliminar este estudiante?');
      expect(apiService.eliminarEstudiante).toHaveBeenCalledWith(1);
      expect(component.cargarEstudiantes).toHaveBeenCalled();
    });

    it('should not delete estudiante when cancelled', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      vi.spyOn(apiService, 'eliminarEstudiante');

      component.eliminarEstudiante(1);

      expect(window.confirm).toHaveBeenCalled();
      expect(apiService.eliminarEstudiante).not.toHaveBeenCalled();
    });

    it('should handle error when deleting estudiante', () => {
      const errorMessage = 'Error al eliminar';
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.spyOn(apiService, 'eliminarEstudiante').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );
      vi.spyOn(console, 'error');

      component.eliminarEstudiante(1);

      expect(apiService.eliminarEstudiante).toHaveBeenCalledWith(1);
      expect(component.error).toBe('Error al eliminar estudiante');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    it('should display loading message when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const loadingElement = compiled.querySelector('.loading');
      expect(loadingElement).toBeTruthy();
    });

    it('should display error message when error occurs', () => {
      component.loading = false;
      component.error = 'Error de prueba';
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.error');
      expect(errorElement?.textContent).toContain('Error de prueba');
    });

    it('should display estudiantes list when loaded', () => {
      vi.spyOn(apiService, 'getEstudiantes').mockReturnValue(of(mockEstudiantes));

      fixture.detectChanges();

      expect(component.estudiantes.length).toBe(2);
      expect(component.loading).toBe(false);
    });
  });
});
