import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html'
})
export default class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userData = this.authService.currentUserValue;
  isLoading = true;
  isSidebarCollapsed = false;
  showLogoutMenu = false;
  
  ngOnInit() {
    this.isLoading = false;
  }
  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleLogoutMenu() {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
