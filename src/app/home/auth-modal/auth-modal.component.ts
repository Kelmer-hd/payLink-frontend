import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  readonly activeTabClass = 'px-4 py-2 rounded-lg bg-blue-600 text-white transition-all duration-300';
  readonly inactiveTabClass = 'px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-all duration-300';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({

    });
    this.isLogin = this.initialMode === 'login';
    this.initForm();
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

      const action = this.isLogin
        ? this.authService.login(this.authForm.value)
        : this.authService.register({
            ...this.authForm.value,
            role: 'SELLER',
            settings: {
              whatsappNumber: this.authForm.value.phone || '',
              autoReplyMessage: '',
              customTheme: 'DARK',
              paymentMethods: []
            }
          });

      action.subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.closeModal();
        },
        error: (error) => {
          this.error = error.error.message || `Error durante ${this.isLogin ? 'el inicio de sesión' : 'el registro'}`;
          this.isLoading = false;
        }
      });
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
