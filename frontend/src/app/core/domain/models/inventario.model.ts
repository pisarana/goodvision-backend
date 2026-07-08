import { Producto } from './producto.model';

export interface Inventario {
  idInventario?: number;
  producto: Producto;
  stock: number;
  stockMinimo: number;
}
