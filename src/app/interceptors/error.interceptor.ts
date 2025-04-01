import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  
  return next(req).pipe(
    catchError((error) => {
      const apiError = errorHandler.handleError(error);
      
      // Aquí puedes agregar lógica adicional según el tipo de error
      switch (error.status) {
        case 401:
          // Manejar error de autenticación
          break;
        case 403:
          // Manejar error de autorización
          break;
        case 404:
          // Manejar error de recurso no encontrado
          break;
        case 409:
          // Manejar error de conflicto
          break;
        default:
          // Manejar otros errores
          break;
      }

      return throwError(() => apiError);
    })
  );
}; 