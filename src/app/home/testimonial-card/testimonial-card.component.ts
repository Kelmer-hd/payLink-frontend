import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial-card',
  imports: [],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.css'
})
export class TestimonialCardComponent {
  @Input({ required: true }) quote!: string;
  @Input({ required: true }) author!: string;
  @Input({ required: true }) role!: string;
}
