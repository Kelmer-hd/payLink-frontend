import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  authForm: FormGroup;  // Define el tipo
  isLoading = false;
  error: string | null = null;
  isLogin = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa authForm aquí en el constructor
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private initForm(): void {
    const baseForm = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    };

    if (!this.isLogin) {
      Object.assign(baseForm, {
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        businessName: ['', Validators.required]
      });
    }

    this.authForm = this.fb.group(baseForm);
  }

  toggleMode(isLogin: boolean): void {
    this.isLogin = isLogin;
    this.error = null;
    this.initForm();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.isLoading = true;
      this.error = null;

      const action = this.isLogin
        ? this.authService.login(this.authForm.value)
        : this.authService.register({
            ...this.authForm.value,
            role: 'SELLER',
            settings: {
              whatsappNumber: '',
              autoReplyMessage: '',
              customTheme: 'LIGHT',
              paymentMethods: []
            }
          });

      action.subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = error.error.message || `Error durante ${this.isLogin ? 'el inicio de sesión' : 'el registro'}`;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
