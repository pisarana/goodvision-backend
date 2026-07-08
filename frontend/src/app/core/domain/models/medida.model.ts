import { Cliente } from './cliente.model';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  role: string;
}

export interface DetalleMedida {
  idDetalleMedida?: number;
  ojo: string; // "OJO_DERECHO" | "OJO_IZQUIERDO"
  esfera: number | null;
  cilindro: number | null;
  eje: number | null;
}

export interface EvaluacionMedida {
  idEvaluacion?: number;
  usuario: Usuario;
  cliente: Cliente;
  fechaEvaluacion: string;
  tipoEvaluacion?: string;
  observaciones?: string;
  detalles: DetalleMedida[];
}

export interface EvaluacionMedidaRequest {
  idUsuario: number;
  idCliente: number;
  tipoEvaluacion?: string;
  observaciones?: string;
  detalles: DetalleMedidaRequest[];
}

export interface DetalleMedidaRequest {
  ojo: string;
  esfera: number | null;
  cilindro: number | null;
  eje: number | null;
}
