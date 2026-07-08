import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

export interface DetalleVenta {
  idDetalleVenta?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  idVenta?: number;
  cliente: Cliente;
  fechaVenta: string;
  total: number;
  metodoPago: string;
  detalles: DetalleVenta[];
}

export interface VentaRequest {
  idCliente: number;
  metodoPago: string;
  detalles: DetalleVentaRequest[];
}

export interface DetalleVentaRequest {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}
