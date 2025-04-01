import { Injectable } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate: CanActivateFn = () => {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser?.token) {
      this.router.navigate(['/app/dashboard']);
      return false;
    }

    return true;
  }
}