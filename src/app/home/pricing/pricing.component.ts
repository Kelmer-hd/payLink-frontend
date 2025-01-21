import { Component } from '@angular/core';
import { PricingPlan } from '../../interfaces/pricing-plan.interface';
import { PricingCardComponent } from '../pricing-card/pricing-card.component';

@Component({
  selector: 'app-pricing',
  imports: [PricingCardComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  plans: PricingPlan[] = [
    {
      title: 'Emprendedor',
      price: 'S/0',
      period: '/siempre',
      features: [
        '3 productos activos',
        'Links ilimitados',
        'Pagos con Yape/Plin',
        'Estadísticas básicas',
        'Soporte por correo',
        'Sin comisiones por venta'
      ],
      cta: 'Empezar gratis',
      highlighted: false
    },
    {
      title: 'Básico',
      price: 'S/29',
      period: '/mes',
      features: [
        '15 productos activos',
        'Links personalizados',
        'Pagos con Yape/Plin',
        'Estadísticas completas',
        'Soporte por WhatsApp',
        'Personalización básica',
        'Sin comisiones por venta'
      ],
      cta: 'Prueba 30 días gratis',
      highlighted: true
    },
    {
      title: 'Pro',
      price: 'S/59',
      period: '/mes',
      features: [
        'Productos ilimitados',
        'Links personalizados',
        'Dashboard avanzado',
        'Reportes detallados',
        'Soporte prioritario 24/7',
        'Personalización completa',
        'Múltiples administradores',
        'Sin comisiones por venta'
      ],
      cta: 'Prueba 30 días gratis',
      highlighted: false
    }
  ];
}
