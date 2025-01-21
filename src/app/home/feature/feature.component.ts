import { Component } from '@angular/core';
import { Feature } from '../../interfaces/feature.interface';
import { FeatureCardComponent } from '../feature-card/feature-card.component';

@Component({
  selector: 'app-feature',
  imports: [FeatureCardComponent],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {

  features: Feature[] = [
    {
      icon: 'smartphone',
      title: 'Links únicos',
      description: 'Cada producto tiene su propia página optimizada para móviles'
    },
    {
      icon: 'share2',
      title: 'Comparte donde sea',
      description: 'WhatsApp, Instagram, Facebook, correo, donde prefieras'
    },
    {
      icon: 'credit-card',
      title: 'Pagos locales',
      description: 'Acepta Yape y Plin directamente'
    },
    {
      icon: 'bar-chart-2',
      title: 'Analíticas simples',
      description: 'Mira tus ventas y métricas importantes'
    },
    {
      icon: 'message-circle',
      title: 'Chat integrado',
      description: 'Gestiona pedidos por WhatsApp automáticamente'
    },
    {
      icon: 'shopping-bag',
      title: 'Variantes de producto',
      description: 'Configura tallas, colores y más opciones'
    }
  ];

}
