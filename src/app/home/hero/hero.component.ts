import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, AuthModalComponent],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  showAuthModal = false;
  authMode: 'login' | 'register' = 'register';
  @Output() openAuth = new EventEmitter<void>();
}
