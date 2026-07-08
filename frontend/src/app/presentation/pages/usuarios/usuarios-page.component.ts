import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosApplication } from '../../../core/application/usuarios.application';
import { Usuario } from '../../../core/domain/models/usuario.model';

@Component({
  selector: 'gv-usuarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios-page.component.html',
  styleUrl: './usuarios-page.component.css'
})
export class UsuariosPageComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  searchTerm = '';
  editingId: number | null = null;
  showCreateForm = false;

  readonly form = this.fb.group({
    nombre:    this.fb.nonNullable.control('', Validators.required),
    apellido:  this.fb.nonNullable.control('', Validators.required),
    correo:    this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    telefono:  this.fb.nonNullable.control(''),
    direccion: this.fb.nonNullable.control(''),
    estado:    this.fb.nonNullable.control('ACTIVO'),
    role:      this.fb.nonNullable.control<'ADMIN' | 'ESPECIALISTA'>('ESPECIALISTA', Validators.required),
    password:  this.fb.nonNullable.control('')
  });

  readonly createForm = this.fb.group({
    nombre:   this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
    apellido: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]),
    correo:   this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    role:     this.fb.nonNullable.control<'ADMIN' | 'ESPECIALISTA'>('ESPECIALISTA', Validators.required),
    telefono: this.fb.nonNullable.control('', Validators.pattern(/^\d{9}$/))
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly usuariosApp: UsuariosApplication
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(term = this.searchTerm): void {
    this.loading = true;
    this.message = '';
    this.usuariosApp.list(term).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo cargar usuarios.', 'error');
      }
    });
  }

  edit(u: Usuario): void {
    this.editingId = u.idUsuario ?? null;
    this.message = '';
    this.form.patchValue({
      nombre:    u.nombre,
      apellido:  u.apellido,
      correo:    u.correo,
      telefono:  u.telefono ?? '',
      direccion: u.direccion ?? '',
      estado:    u.estado ?? 'ACTIVO',
      role:      u.role,
      password:  ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showMessage('Por favor corrige los errores del formulario.', 'error');
      return;
    }
    if (!this.editingId) {
      this.showMessage('Selecciona un usuario para editar.', 'error');
      return;
    }

    const v = this.form.getRawValue();
    const usuario: Usuario = {
      nombre:    v.nombre,
      apellido:  v.apellido,
      correo:    v.correo,
      telefono:  v.telefono,
      direccion: v.direccion,
      estado:    v.estado,
      role:      v.role,
      ...(v.password ? { password: v.password } : {})
    };

    this.loading = true;
    this.usuariosApp.update(this.editingId, usuario).subscribe({
      next: () => {
        this.showMessage('Usuario actualizado.', 'success');
        this.reset();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo actualizar.', 'error');
      }
    });
  }

  remove(u: Usuario): void {
    if (!u.idUsuario || !confirm(`Eliminar usuario ${u.nombre} ${u.apellido}?`)) return;
    this.loading = true;
    this.usuariosApp.delete(u.idUsuario).subscribe({
      next: () => {
        this.showMessage('Usuario eliminado.', 'success');
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo eliminar.', 'error');
      }
    });
  }

  createUser(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.showMessage('Por favor corrige los errores del formulario.', 'error');
      return;
    }
    const v = this.createForm.getRawValue();
    this.loading = true;
    this.usuariosApp.create({
      nombre:   v.nombre,
      apellido: v.apellido,
      correo:   v.correo,
      password: v.password,
      role:     v.role,
      telefono: v.telefono || undefined
    }).subscribe({
      next: () => {
        this.showMessage('Usuario creado correctamente.', 'success');
        this.cancelCreate();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo crear el usuario.', 'error');
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.createForm.reset({ nombre: '', apellido: '', correo: '', password: '', role: 'ESPECIALISTA', telefono: '' });
  }

  reset(): void {
    this.editingId = null;
    this.form.reset({ nombre: '', apellido: '', correo: '', telefono: '', direccion: '', estado: 'ACTIVO', role: 'ESPECIALISTA', password: '' });
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }

  getRoleBadge(role: string): string {
    return role === 'ADMIN' ? 'badge-admin' : 'badge-esp';
  }
}
