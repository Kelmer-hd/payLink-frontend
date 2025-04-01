import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 5000): void {
    this.show('success', message, duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.show('error', message, duration);
  }

  showWarning(message: string, duration: number = 5000): void {
    this.show('warning', message, duration);
  }

  showInfo(message: string, duration: number = 5000): void {
    this.show('info', message, duration);
  }

  private show(type: Notification['type'], message: string, duration: number): void {
    this.notificationSubject.next({ type, message });

    // Auto-hide after specified duration
    setTimeout(() => {
      if (this.notificationSubject.value?.message === message) {
        this.notificationSubject.next(null);
      }
    }, duration);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
} 