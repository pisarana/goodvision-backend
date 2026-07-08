export type UserRole = 'ADMIN' | 'ESPECIALISTA';

export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
  estado?: string;
  role: UserRole;
  password?: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  role: UserRole;
  telefono?: string;
  direccion?: string;
}
