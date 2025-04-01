import { Injectable } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate: CanActivateFn = () => {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser?.token) {
      console.log('Acceso permitido');
      return true;
    }
  
    console.log('Acceso denegado, redirigiendo a /auth');
    this.router.navigate(['/auth']);
    return false;
  }


  
}