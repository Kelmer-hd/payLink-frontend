import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterRequest } from '../../interfaces/models/auth.model';

@Component({
  selector: 'app-auth-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() initialMode: 'login' | 'register' = 'register';

  authForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  isLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({});
    this.isLogin = this.initialMode === 'login';
    this.initForm();
  }

  private initForm(): void {
    const baseForm = {
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/)]]
    };
  
    if (!this.isLogin) {
      Object.assign(baseForm, {
        fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
        dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
        businessName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
        whatsappNumber: ['', [Validators.pattern(/^[0-9]{9}$/)]],
        autoReplyMessage: ['Gracias por contactarnos'],
        paymentMethods: this.fb.array([])
      });
    }
  
    this.authForm = this.fb.group(baseForm);
  }

  setMode(isLogin: boolean): void {
    this.isLogin = isLogin;
    this.error = null;
    this.initForm();
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.isLoading = true;
      this.error = null;

      if (this.isLogin) {
        this.authService.login(this.authForm.value).subscribe({
          next: () => {
            this.router.navigate(['/app/dashboard']);
            this.closeModal();
          },
          error: (error) => {
            this.error = error.error?.message || 'Error durante el inicio de sesión';
            this.isLoading = false;
          }
        });
      } else {
        // Preparar datos de registro según el swagger
        const registerData: RegisterRequest = {
          email: this.authForm.value.email,
          password: this.authForm.value.password,
          fullName: this.authForm.value.fullName,
          dni: this.authForm.value.dni,
          phone: this.authForm.value.phone,
          businessName: this.authForm.value.businessName,
          role: 'SELLER',
          subscriptionPlan: 'FREE',
          settings: {
            whatsappNumber: this.authForm.value.whatsappNumber || this.authForm.value.phone,
            autoReplyMessage: this.authForm.value.autoReplyMessage || 'Gracias por contactarnos',
            customTheme: 'LIGHT',
            paymentMethods: ['YAPE', 'PLIN']
          }
        };

        this.authService.register(registerData).subscribe({
          next: () => {
            this.router.navigate(['/app/dashboard']);
            this.closeModal();
          },
          error: (error) => {
            this.error = error.error?.message || 'Error durante el registro';
            this.isLoading = false;
          }
        });
      }
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
