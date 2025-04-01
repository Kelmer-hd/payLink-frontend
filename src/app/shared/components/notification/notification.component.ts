import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notification$ | async; as notification) {
      <div 
        class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg animate-fade-in"
        [ngClass]="{
          'bg-green-50 text-green-800 border border-green-200': notification.type === 'success',
          'bg-red-50 text-red-800 border border-red-200': notification.type === 'error',
          'bg-yellow-50 text-yellow-800 border border-yellow-200': notification.type === 'warning',
          'bg-blue-50 text-blue-800 border border-blue-200': notification.type === 'info'
        }"
      >
        {{ notification.message }}
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(1rem); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
  `]
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notification$ = this.notificationService.notification$;
} 