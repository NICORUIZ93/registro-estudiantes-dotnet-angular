export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  createdAt: Date;
  totalCreditos: number;
  materias: MateriaInscrita[];
}

export interface MateriaInscrita {
  id: number;
  nombre: string;
  creditos: number;
  profesorNombre: string;
}

export interface CrearEstudiante {
  nombre: string;
  apellido: string;
  email: string;
  materiasIds: number[];
}

export interface ActualizarEstudiante {
  nombre: string;
  apellido: string;
  email: string;
}
