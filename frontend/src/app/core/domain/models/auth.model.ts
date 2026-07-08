export type UserRole = 'ADMIN' | 'ESPECIALISTA';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
  role: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  password: string;
  role: UserRole;
}
