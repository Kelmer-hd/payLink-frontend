import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  @Output() openAuth = new EventEmitter<void>();
  @Output() scrollTo = new EventEmitter<string>();

  handleScroll(event: Event, id: string): void {
    event.preventDefault();
    this.scrollTo.emit(id);
  }

}
