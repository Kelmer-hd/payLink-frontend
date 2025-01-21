import { Component } from '@angular/core';
import { Testimonial } from '../../interfaces/testimonial.interface';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';

@Component({
  selector: 'app-testimonials',
  imports: [TestimonialCardComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      quote: 'Antes usaba Google Forms. Esto es mil veces mejor y más profesional.',
      author: 'María G.',
      role: 'Vendedora de ropa'
    },
    {
      quote: 'Lo mejor es que mis clientes pueden pagar directamente con Yape.',
      author: 'Carlos R.',
      role: 'Tienda de tecnología'
    },
    {
      quote: 'Simplifiqué todas mis ventas de Instagram en una sola plataforma.',
      author: 'Ana L.',
      role: 'Emprendedora'
    }
  ];
}
