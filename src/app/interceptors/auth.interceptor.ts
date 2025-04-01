import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Obtén el servicio AuthService
  const router = inject(Router); // Obtén el servicio Router

  const currentUser = authService.currentUserValue;


  // Clona la solicitud y agrega el token JWT a la cabecera
  if (currentUser?.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
  }

  // Maneja la solicitud y captura errores
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expirado
        authService.logout().subscribe(() => {
          router.navigate(['/auth']);
        });
      }
      return throwError(() => error);
    })
  );
};