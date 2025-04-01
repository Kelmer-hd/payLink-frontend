import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="errorMessage$ | async as errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  `,
  styles: [`
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class FormErrorComponent implements OnInit {
  @Input() fieldName!: string;
  errorMessage$!: Observable<string | undefined>;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit() {
    this.errorMessage$ = this.errorHandler.getValidationError(this.fieldName);
  }
} 