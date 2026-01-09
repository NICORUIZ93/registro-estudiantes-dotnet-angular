export interface Materia {
  id: number;
  nombre: string;
  creditos: number;
  profesorId: number;
  profesorNombre: string;
}

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  materias: Materia[];
}

export interface CompanerosPorMateria {
  materiaId: number;
  materiaNombre: string;
  companeros: string[];
}
