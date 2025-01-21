import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pricing-card',
  imports: [],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.css'
})
export class PricingCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) price!: string;
  @Input({ required: true }) period!: string;
  @Input({ required: true }) features!: string[];
  @Input({ required: true }) cta!: string;
  @Input() highlighted = false;

  get cardClasses(): string {
    return `p-8 rounded-2xl border backdrop-blur-sm transition-all ${
      this.highlighted
        ? 'border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent'
        : 'border-white/10 bg-gradient-to-b from-white/5 to-transparent'
    }`;
  }

  get buttonClasses(): string {
    return `w-full py-3 rounded-full transition-all ${
      this.highlighted
        ? 'bg-white text-black hover:bg-gray-100'
        : 'border border-white/10 hover:bg-white/5'
    }`;
  }
}
