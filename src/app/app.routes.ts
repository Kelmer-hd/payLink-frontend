import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { PublicProductComponent } from './public/product/product.component';

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
    title: 'Panel de administración',
    loadComponent: () => import('./admin/seller/layout/layout.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./admin/seller/dashboard/dashboard.component')
      },
      {
        path: 'products',
        title: 'Productos',
        children: [
          {
            path: '',
            title: 'Lista de productos',
            loadComponent: () => import('./admin/seller/products/products.component')
          },
          {
            path: 'new',
            title: 'Nuevo producto',
            loadComponent: () => import('./admin/seller/product-form/product-form.component')
          },
          {
            path: 'edit/:id',
            title: 'Editar producto',
            loadComponent: () => import('./admin/seller/product-form/product-form.component')
          }
        ]
      }
    ]
  },
  {
    path: 'producto/:slug',
    component: PublicProductComponent
  },
  { path: '**', redirectTo: '/' }
];