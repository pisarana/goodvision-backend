import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VentasApplication } from '../../../core/application/ventas.application';
import { ClientesApplication } from '../../../core/application/clientes.application';
import { ProductosApplication } from '../../../core/application/productos.application';
import { InventarioApplication } from '../../../core/application/inventario.application';
import { AuthApplication } from '../../../core/application/auth.application';
import { Venta, DetalleVentaRequest } from '../../../core/domain/models/venta.model';
import { Cliente } from '../../../core/domain/models/cliente.model';
import { Producto } from '../../../core/domain/models/producto.model';
import { Inventario } from '../../../core/domain/models/inventario.model';
import { CommonModule } from '@angular/common';

interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'gv-ventas-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-page.component.html',
  styleUrl: './ventas-page.component.css'
})
export class VentasPageComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  inventario: Inventario[] = [];
  loading = false;
  registrando = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  searchTerm = '';
  historialSearch = '';
  isAdmin = false;
  expandedVentaIds: Set<number> = new Set();

  carrito: CarritoItem[] = [];
  selectedCliente: Cliente | null = null;
  metodoPago: string = 'EFECTIVO';

  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;

  constructor(
    private readonly ventasApplication: VentasApplication,
    private readonly clientesApplication: ClientesApplication,
    private readonly productosApplication: ProductosApplication,
    private readonly inventarioApplication: InventarioApplication,
    private readonly authApplication: AuthApplication
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authApplication.isAdmin();
    this.loadVentas();
    this.loadClientes();
    this.loadProductos();
    this.fetchInventario();
  }

  loadVentas(): void {
    this.loading = true;
    this.ventasApplication.list().subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage('Error al cargar ventas: ' + (err.message || ''), 'error');
      }
    });
  }

  loadClientes(): void {
    this.clientesApplication.list().subscribe({
      next: (clientes) => { this.clientes = clientes; },
      error: () => {}
    });
  }

  loadProductos(): void {
    this.productosApplication.list().subscribe({
      next: (productos) => {
        this.productos = productos.filter(p => p.precio > 0);
      },
      error: () => {}
    });
  }

  fetchInventario(): void {
    this.inventarioApplication.list().subscribe({
      next: (inv) => { this.inventario = inv; },
      error: () => {}
    });
  }

  getStock(idProducto: number): number {
    const inv = this.inventario.find(i => i.producto.idProducto === idProducto);
    return inv ? inv.stock : -1;
  }

  stockDisponible(producto: Producto): boolean {
    const stock = this.getStock(producto.idProducto!);
    return stock === -1 || stock > 0;
  }

  selectProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.cantidadSeleccionada = 1;
  }

  agregarAlCarrito(): void {
    if (!this.productoSeleccionado) {
      this.showMessage('Selecciona un producto del catálogo.', 'error');
      return;
    }
    if (this.cantidadSeleccionada < 1) {
      this.showMessage('La cantidad debe ser al menos 1.', 'error');
      return;
    }

    const stock = this.getStock(this.productoSeleccionado.idProducto!);
    const enCarrito = this.carrito.find(i => i.producto.idProducto === this.productoSeleccionado!.idProducto);
    const cantidadActual = enCarrito?.cantidad ?? 0;
    const totalPedido = cantidadActual + this.cantidadSeleccionada;

    if (stock !== -1 && totalPedido > stock) {
      const disponible = stock - cantidadActual;
      if (disponible <= 0) {
        this.showMessage(`"${this.productoSeleccionado.nombreProducto}" ya no tiene stock disponible (stock: ${stock}).`, 'error');
      } else {
        this.showMessage(`Solo quedan ${disponible} unidad(es) disponibles de "${this.productoSeleccionado.nombreProducto}".`, 'error');
      }
      return;
    }

    if (enCarrito) {
      enCarrito.cantidad += this.cantidadSeleccionada;
      enCarrito.subtotal = enCarrito.cantidad * enCarrito.producto.precio;
    } else {
      this.carrito.push({
        producto: this.productoSeleccionado,
        cantidad: this.cantidadSeleccionada,
        subtotal: this.cantidadSeleccionada * this.productoSeleccionado.precio
      });
    }

    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }

  eliminarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
  }

  actualizarCantidad(item: CarritoItem, cantidad: number): void {
    if (cantidad < 1) return;
    item.cantidad = cantidad;
    item.subtotal = item.cantidad * item.producto.precio;
  }

  calcularTotal(): number {
    return this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
  }

  registrarVenta(): void {
    if (!this.selectedCliente) {
      this.showMessage('Selecciona un cliente para continuar', 'error');
      return;
    }
    if (this.carrito.length === 0) {
      this.showMessage('Agrega al menos un producto al carrito', 'error');
      return;
    }

    const detalles: DetalleVentaRequest[] = this.carrito.map(item => ({
      idProducto: item.producto.idProducto!,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio
    }));

    const ventaRequest = {
      idCliente: this.selectedCliente.idCliente!,
      metodoPago: this.metodoPago,
      detalles
    };

    this.registrando = true;
    this.message = '';

    this.ventasApplication.save(ventaRequest).subscribe({
      next: () => {
        this.showMessage('¡Venta registrada exitosamente! 🎉', 'success');
        this.limpiarVenta();
        this.loadVentas();
      },
      error: (err) => {
        this.registrando = false;
        this.showMessage(err.message || 'Error al registrar la venta. Intenta nuevamente.', 'error');
      }
    });
  }

  limpiarVenta(): void {
    this.carrito = [];
    this.selectedCliente = null;
    this.metodoPago = 'EFECTIVO';
    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
    this.registrando = false;
  }

  eliminarVenta(venta: Venta): void {
    if (!venta.idVenta) return;

    if (!this.isAdmin) {
      alert('Solo los administradores pueden eliminar ventas.');
      return;
    }

    if (!confirm(`¿Eliminar la venta #${venta.idVenta} de ${venta.cliente.nombre} ${venta.cliente.apellido}? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.loading = true;
    this.ventasApplication.delete(venta.idVenta).subscribe({
      next: () => {
        this.showMessage('✅ Venta eliminada exitosamente.', 'success');
        this.loadVentas();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          alert('No tienes permisos de administrador para eliminar ventas');
          console.error('403 Forbidden: Usuario sin permisos de administrador', err);
        } else {
          alert('Error al eliminar la venta. Intenta nuevamente.');
          console.error('Error al eliminar venta:', err);
        }
      }
    });
  }

  filtrarProductos(): Producto[] {
    if (!this.searchTerm) return this.productos;
    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(p =>
      p.nombreProducto.toLowerCase().includes(term) ||
      p.categoria?.nombreCategoria?.toLowerCase().includes(term)
    );
  }

  filtrarVentas(): Venta[] {
    if (!this.historialSearch) return this.ventas;
    const term = this.historialSearch.toLowerCase();
    return this.ventas.filter(v =>
      v.cliente.nombre.toLowerCase().includes(term) ||
      v.cliente.apellido.toLowerCase().includes(term) ||
      String(v.idVenta).includes(term)
    );
  }

  onClienteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idCliente = +target.value;
    this.selectedCliente = this.clientes.find(c => c.idCliente === idCliente) || null;
  }

  getMetodoPagoIcon(metodo: string): string {
    const icons: Record<string, string> = {
      'EFECTIVO': '💵',
      'TARJETA': '💳',
      'TRANSFERENCIA': '🏦',
      'YAPE': '📱'
    };
    return icons[metodo] || '💰';
  }

  toggleExpand(id: number): void {
    if (this.expandedVentaIds.has(id)) {
      this.expandedVentaIds.delete(id);
    } else {
      this.expandedVentaIds.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedVentaIds.has(id);
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 6000);
  }

  getTotalVentasHoy(): number {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
    return this.ventas
      .filter(v => (v.fechaVenta as unknown as string) === hoyStr)
      .reduce((sum, v) => sum + v.total, 0);
  }
}
