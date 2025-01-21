import { Component } from '@angular/core';
import { StepCardComponent } from '../step-card/step-card.component';

@Component({
  selector: 'app-how-it-works',
  imports: [StepCardComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  steps = [
    {
      number: '01',
      title: 'Crea tu producto',
      description: 'Sube fotos, descripción y configura el precio y opciones'
    },
    {
      number: '02',
      title: 'Personaliza tu link',
      description: 'Obtén un link único y personalizado para tu producto'
    },
    {
      number: '03',
      title: 'Comparte y vende',
      description: 'Comparte en WhatsApp y empieza a recibir pedidos'
    }
  ];
}
