import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';

      if (error.error && error.error.message) {
        // Structured ErrorResponse from backend
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'No se puede conectar al servidor. Verifique que el backend esté ejecutándose.';
      } else if (error.status === 401) {
        errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
        // Could redirect to login here if needed
        // inject(Router).navigate(['/login']);
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'Recurso no encontrado.';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'El recurso ya existe.';
      } else if (error.status === 422) {
        errorMessage = error.error?.message || 'No se puede procesar la solicitud.';
      } else if (error.status >= 500) {
        errorMessage = error.error?.message || 'Error interno del servidor. Contacte al administrador.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
