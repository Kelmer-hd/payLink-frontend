import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.apiUrl}/api/v1/auth`;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Plan:', response.subscriptionPlan); // Debug
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  register(formData: RegisterRequest): Observable<AuthResponse> {
    const registerData: RegisterRequest = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      dni: formData.dni,
      phone: formData.phone,
      businessName: formData.businessName,
      role: 'SELLER',
      subscriptionPlan: 'FREE',
      settings: {
        whatsappNumber: formData.phone,
        autoReplyMessage: 'Gracias por contactarnos',
        customTheme: 'LIGHT',
        paymentMethods: ['YAPE', 'PLIN']
      }
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData)
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  verifyEmail(code: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/verify-email`, { code });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        })
      );
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  // Método para manejar el token en las peticiones HTTP
  getAuthorizationToken(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.token : null;
  }
}