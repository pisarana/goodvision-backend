export interface Categoria {
  idCategoria: number;
  nombreCategoria?: string;
}

export interface Producto {
  idProducto?: number;
  nombreProducto: string;
  precio: number;
  categoria: Categoria;
}
