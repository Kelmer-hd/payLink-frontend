import { Injectable } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = () => {
    if (!this.authService.currentUserValue) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}