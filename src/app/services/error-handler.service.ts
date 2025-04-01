import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  title?: string;
  detail: string;
  status: number;
  errors?: { [key: string]: string };
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private validationErrorsSubject = new BehaviorSubject<ValidationError[]>([]);
  validationErrors$ = this.validationErrorsSubject.asObservable();

  handleError(error: HttpErrorResponse): ApiError {
    const apiError: ApiError = {
      title: error.error?.title || 'Error',
      detail: error.error?.detail || 'Ha ocurrido un error inesperado',
      status: error.status,
      errors: error.error?.errors,
      timestamp: error.error?.timestamp
    };

    // Manejar errores de validación
    if (error.status === 400 && error.error?.errors) {
      const validationErrors: ValidationError[] = Object.entries(error.error.errors).map(
        ([field, message]) => ({
          field,
          message: message as string
        })
      );
      this.validationErrorsSubject.next(validationErrors);
    }

    return apiError;
  }

  clearValidationErrors() {
    this.validationErrorsSubject.next([]);
  }

  getValidationError(field: string): Observable<string | undefined> {
    return new Observable(subscriber => {
      this.validationErrors$.subscribe(errors => {
        const error = errors.find(e => e.field === field);
        subscriber.next(error?.message);
      });
    });
  }
} 