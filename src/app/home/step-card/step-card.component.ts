import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-card',
  imports: [],
  templateUrl: './step-card.component.html',
  styleUrl: './step-card.component.css'
})
export class StepCardComponent {
  @Input({ required: true }) number!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
