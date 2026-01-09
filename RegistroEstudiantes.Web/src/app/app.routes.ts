import { Routes } from '@angular/router';
import { EstudiantesListaComponent } from './components/estudiantes-lista/estudiantes-lista.component';
import { EstudianteFormComponent } from './components/estudiante-form/estudiante-form.component';
import { EstudianteDetalleComponent } from './components/estudiante-detalle/estudiante-detalle.component';

export const routes: Routes = [
  { path: '', component: EstudiantesListaComponent },
  { path: 'registro', component: EstudianteFormComponent },
  { path: 'estudiante/:id', component: EstudianteDetalleComponent },
  { path: '**', redirectTo: '' }
];
