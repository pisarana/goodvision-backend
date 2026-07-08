import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApplication } from '../../../core/application/auth.application';
import { UserRole } from '../../../core/domain/models/auth.model';

const SOLO_LETRAS = Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/);
const SOLO_DIGITOS_9 = Validators.pattern(/^[0-9]{9}$/);

@Component({
  selector: 'gv-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loading = false;
  registerMode = false;
  message = '';
  messageType: 'success' | 'error' = 'error';

  readonly loginForm = this.formBuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly registerForm = this.formBuilder.nonNullable.group({
    nombre:   ['', [Validators.required, SOLO_LETRAS, Validators.maxLength(60)]],
    apellido: ['', [Validators.required, SOLO_LETRAS, Validators.maxLength(60)]],
    correo:   ['', [Validators.required, Validators.email]],
    telefono: ['', [SOLO_DIGITOS_9]],
    direccion: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['ESPECIALISTA' as UserRole, Validators.required]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthApplication,
    private readonly router: Router
  ) {}

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.message = '';
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: (err) => {
        this.loading = false;
        this.messageType = 'error';
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.message = 'Correo o contraseña incorrectos.';
        } else if (status === 0) {
          this.message = 'Sin conexión al servidor. Verifica que el backend esté activo.';
        } else {
          this.message = 'No se pudo iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.message = '';
    this.auth.register(this.registerForm.getRawValue()).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageType = 'success';
        this.registerMode = false;
        this.loginForm.patchValue({
          correo: this.registerForm.controls.correo.value,
          password: this.registerForm.controls.password.value
        });
        this.message = response || 'Usuario creado. Ya puedes ingresar.';
      },
      error: (err) => {
        this.loading = false;
        this.messageType = 'error';
        const status = err?.status;
        if (status === 409) {
          this.message = 'Ya existe una cuenta con ese correo.';
        } else if (status === 0) {
          this.message = 'Sin conexión al servidor.';
        } else {
          this.message = err?.error?.message || 'No se pudo crear el usuario.';
        }
      }
    });
  }
}
