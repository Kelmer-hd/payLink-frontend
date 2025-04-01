import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardData {
  activeProducts: number;
  totalSales: number;
  totalCustomers: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  isLoading = true;
  dashboardData: DashboardData = {
    activeProducts: 0,
    totalSales: 0,
    totalCustomers: 0
  };

  ngOnInit() {
    // Aquí cargarías los datos del dashboard desde tu servicio
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Simulamos la carga de datos
    setTimeout(() => {
      this.dashboardData = {
        activeProducts: 5,
        totalSales: 1500,
        totalCustomers: 10
      };
      this.isLoading = false;
    }, 1000);
  }
}
