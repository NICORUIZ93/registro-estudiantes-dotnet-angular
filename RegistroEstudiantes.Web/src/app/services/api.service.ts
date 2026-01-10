import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Estudiante, CrearEstudiante, ActualizarEstudiante } from '../models/estudiante.model';
import { Materia, Profesor, CompanerosPorMateria } from '../models/materia.model';
import { environment } from '../../environments/environment';

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<PaginatedResponse<Estudiante>>(`${this.apiUrl}/estudiantes`)
      .pipe(
        map(response => response.items)
      );
  }

  getEstudiantesPaginated(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Estudiante>> {
    return this.http.get<PaginatedResponse<Estudiante>>(
      `${this.apiUrl}/estudiantes?page=${page}&pageSize=${pageSize}`
    );
  }

  getEstudiante(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/estudiantes/${id}`);
  }

  crearEstudiante(estudiante: CrearEstudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/estudiantes`, estudiante);
  }

  actualizarEstudiante(id: number, estudiante: ActualizarEstudiante): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/estudiantes/${id}`, estudiante);
  }

  eliminarEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/estudiantes/${id}`);
  }

  getCompaneros(estudianteId: number): Observable<CompanerosPorMateria[]> {
    return this.http.get<CompanerosPorMateria[]>(`${this.apiUrl}/estudiantes/${estudianteId}/companeros`);
  }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/materias`);
  }

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(`${this.apiUrl}/profesores`);
  }
}