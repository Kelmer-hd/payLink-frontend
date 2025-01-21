import { Routes } from '@angular/router';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./home/auth-modal/auth-modal.component').then(m => m.AuthModalComponent)
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./home/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/' }
];