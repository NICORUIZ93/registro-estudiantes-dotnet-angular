import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api.service';
import { Estudiante, CrearEstudiante, ActualizarEstudiante } from '../models/estudiante.model';
import { Materia, Profesor, CompanerosPorMateria } from '../models/materia.model';
import { environment } from '../../environments/environment.development';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Estudiantes', () => {
    it('should fetch all estudiantes', () => {
      const mockEstudiantes: Estudiante[] = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          totalCreditos: 9,
          materias: [],
          createdAt: new Date()
        }
      ];

      service.getEstudiantes().subscribe(estudiantes => {
        expect(estudiantes).toEqual(mockEstudiantes);
        expect(estudiantes.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEstudiantes);
    });

    it('should fetch a single estudiante by id', () => {
      const mockEstudiante: Estudiante = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        totalCreditos: 9,
        materias: [],
        createdAt: new Date()
      };

      service.getEstudiante(1).subscribe(estudiante => {
        expect(estudiante).toEqual(mockEstudiante);
        expect(estudiante.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEstudiante);
    });

    it('should create a new estudiante', () => {
      const nuevoEstudiante: CrearEstudiante = {
        nombre: 'María',
        apellido: 'García',
        email: 'maria@example.com',
        materiasIds: [1, 2, 3]
      };

      const mockResponse: Estudiante = {
        id: 2,
        nombre: 'María',
        apellido: 'García',
        email: 'maria@example.com',
        totalCreditos: 9,
        materias: [],
        createdAt: new Date()
      };

      service.crearEstudiante(nuevoEstudiante).subscribe(estudiante => {
        expect(estudiante).toEqual(mockResponse);
        expect(estudiante.email).toBe('maria@example.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoEstudiante);
      req.flush(mockResponse);
    });

    it('should update an estudiante', () => {
      const actualizarEstudiante: ActualizarEstudiante = {
        nombre: 'Juan',
        apellido: 'Pérez Actualizado',
        email: 'juan.nuevo@example.com'
      };

      service.actualizarEstudiante(1, actualizarEstudiante).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(actualizarEstudiante);
      req.flush(null);
    });

    it('should delete an estudiante', () => {
      service.eliminarEstudiante(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should fetch companeros for an estudiante', () => {
      const mockCompaneros: CompanerosPorMateria[] = [
        {
          materiaId: 1,
          materiaNombre: 'Matemáticas',
          companeros: ['Pedro Gómez', 'Ana López']
        }
      ];

      service.getCompaneros(1).subscribe(companeros => {
        expect(companeros).toEqual(mockCompaneros);
        expect(companeros.length).toBe(1);
        expect(companeros[0].companeros.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes/1/companeros`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCompaneros);
    });
  });

  describe('Materias', () => {
    it('should fetch all materias', () => {
      const mockMaterias: Materia[] = [
        {
          id: 1,
          nombre: 'Matemáticas',
          creditos: 3,
          profesorId: 1,
          profesorNombre: 'Dr. Smith'
        },
        {
          id: 2,
          nombre: 'Física',
          creditos: 4,
          profesorId: 2,
          profesorNombre: 'Dr. Johnson'
        }
      ];

      service.getMaterias().subscribe(materias => {
        expect(materias).toEqual(mockMaterias);
        expect(materias.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/materias`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMaterias);
    });
  });

  describe('Profesores', () => {
    it('should fetch all profesores', () => {
      const mockProfesores: Profesor[] = [
        {
          id: 1,
          nombre: 'John',
          apellido: 'Smith',
          materias: [
            {
              id: 1,
              nombre: 'Matemáticas',
              creditos: 3,
              profesorId: 1,
              profesorNombre: 'John Smith'
            }
          ]
        }
      ];

      service.getProfesores().subscribe(profesores => {
        expect(profesores).toEqual(mockProfesores);
        expect(profesores.length).toBe(1);
        expect(profesores[0].materias.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/profesores`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfesores);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP error for getEstudiantes', () => {
      const errorMessage = 'Server error';

      service.getEstudiantes().subscribe({
        next: () => {
          throw new Error('should have failed with 500 error');
        },
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should handle HTTP error for crearEstudiante', () => {
      const nuevoEstudiante: CrearEstudiante = {
        nombre: 'Test',
        apellido: 'User',
        email: 'invalid-email',
        materiasIds: [1, 2, 3]
      };

      service.crearEstudiante(nuevoEstudiante).subscribe({
        next: () => {
          throw new Error('should have failed with 400 error');
        },
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/estudiantes`);
      req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
