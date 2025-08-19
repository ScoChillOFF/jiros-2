import {
  Component,
  inject,
  signal,
  computed,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  TuiButton,
  TuiIcon,
  TuiTextfield,
  TuiError,
  TuiAlertService,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';

import { UserService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiIcon,
    TuiTextfield,
    TuiError,
    TuiFieldErrorPipe,
    TuiPassword,
    TuiButtonLoading,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Field is required',
        email: 'Incorrect email',
        minlength: ({ requiredLength }: { requiredLength: number }) =>
          `Minimum ${requiredLength} symbols`,
        requiredConfirm: 'Confirmation is required',
        passwordsMismatch: 'Passwords mismatch',
      },
    },
  ],
})
export class LoginPageComponent {
  private users = inject(UserService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private alerts = inject(TuiAlertService);

  mode = signal<'login' | 'register'>('login');
  submitted = signal(false);
  loading = signal(false);

  readonly emailId = 'email-input';
  readonly passId = 'password-input';
  readonly confirmId = 'confirm-input';

  form = new FormGroup(
    {
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
      }),
    },
    { validators: this.confirmValidator() }
  );

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  isRegister = computed(() => this.mode() === 'register');

  setMode(next: 'login' | 'register') {
    this.mode.set(next);
    this.submitted.set(false);
    this.form.reset();
    this.form.updateValueAndValidity({ emitEvent: false });
  }

  submit() {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    const { email, password } = this.form.value;
    const req$ =
      this.mode() === 'login'
        ? this.users.login$(email, password)
        : this.users.register$(email, password);

    req$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (user) => {
          if (user) this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.alerts.open(err, { appearance: 'error' }).subscribe();
        },
      });
  }

  private confirmValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const isReg = this.mode() === 'register';
      const pass = group.get('password');
      const confirm = group.get('confirmPassword');

      if (!pass || !confirm) {
        return null;
      }

      if (!isReg) {
        if (confirm.errors) confirm.setErrors(null);
        return null;
      }

      const p = pass.value ?? '';
      const c = confirm.value ?? '';

      if (!p || !c) {
        confirm.setErrors({ requiredConfirm: true });
        return null;
      }

      if (p !== c) {
        confirm.setErrors({ passwordsMismatch: true });
        return null;
      }

      confirm.setErrors(null);
      return null;
    };
  }
}
