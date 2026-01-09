import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface AppError {
  message: string;
  status: number;
  statusText: string;
  url: string | null;
  originalError?: any;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error desconocido';
      let appError: AppError;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error de conexión: ${error.error.message}`;
        appError = {
          message: errorMessage,
          status: 0,
          statusText: 'Client Error',
          url: error.url,
          originalError: error.error
        };
      } else {
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || error.error?.error || 'Solicitud inválida. Verifica los datos enviados.';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor inicia sesión.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage = error.error?.message || 'Recurso no encontrado.';
        } else if (error.status === 409) {
          errorMessage = error.error?.message || 'Ya existe un registro con esos datos.';
        } else if (error.status === 422) {
          errorMessage = error.error?.message || 'Error de validación. Verifica los datos.';
        } else if (error.status >= 500) {
          errorMessage = error.error?.message || `Error del servidor (${error.status}). Por favor intenta más tarde.`;
        } else {
          errorMessage = error.error?.message || `Error inesperado (${error.status}).`;
        }

        appError = {
          message: errorMessage,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          originalError: error.error
        };
      }

      console.error('Error HTTP capturado:', {
        status: appError.status,
        statusText: appError.statusText,
        message: appError.message,
        url: appError.url,
        originalError: appError.originalError
      });

      return throwError(() => appError);
    })
  );
};
