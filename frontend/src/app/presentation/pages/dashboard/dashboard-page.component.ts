import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientesApplication } from '../../../core/application/clientes.application';
import { ProductosApplication } from '../../../core/application/productos.application';
import { VentasApplication } from '../../../core/application/ventas.application';
import { MedidasApplication } from '../../../core/application/medidas.application';
import { InventarioApplication } from '../../../core/application/inventario.application';
import { Producto } from '../../../core/domain/models/producto.model';
import { Cliente } from '../../../core/domain/models/cliente.model';
import { Venta } from '../../../core/domain/models/venta.model';
import { Inventario } from '../../../core/domain/models/inventario.model';

@Component({
  selector: 'gv-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  loading = true;
  status = 'Conectando...';

  totalProductos = 0;
  totalClientes = 0;
  totalVentas = 0;
  totalMedidas = 0;
  ingresosMes = 0;
  promedioVenta = 0;

  productosRecientes: Producto[] = [];
  clientesRecientes: Cliente[] = [];
  ultimasVentas: Venta[] = [];
  alertasStockBajo: Inventario[] = [];

  constructor(
    private readonly productosApp: ProductosApplication,
    private readonly clientesApp: ClientesApplication,
    private readonly ventasApp: VentasApplication,
    private readonly medidasApp: MedidasApplication,
    private readonly inventarioApp: InventarioApplication
  ) {}

  ngOnInit(): void {
    forkJoin({
      productos: this.productosApp.list(),
      clientes: this.clientesApp.list(),
      ventas: this.ventasApp.list(),
      medidas: this.medidasApp.list(),
      inventario: this.inventarioApp.list()
    }).subscribe({
      next: ({ productos, clientes, ventas, medidas, inventario }) => {
        this.totalProductos = productos.length;
        this.totalClientes = clientes.length;
        this.totalVentas = ventas.length;
        this.totalMedidas = medidas.length;

        const hace30dias = new Date();
        hace30dias.setMonth(hace30dias.getMonth() - 1);
        const ventasMes = ventas.filter(v => new Date(v.fechaVenta) >= hace30dias);
        this.ingresosMes = ventasMes.reduce((sum, v) => sum + Number(v.total), 0);
        this.promedioVenta = ventas.length > 0
          ? ventas.reduce((s, v) => s + Number(v.total), 0) / ventas.length
          : 0;

        this.productosRecientes = productos.slice(0, 5);
        this.clientesRecientes = clientes.slice(0, 5);
        this.ultimasVentas = ventas.slice(0, 5);
        this.alertasStockBajo = inventario.filter(i => i.stock <= i.stockMinimo).slice(0, 5);

        this.status = 'API conectada';
        this.loading = false;
      },
      error: () => {
        this.status = 'Error al conectar';
        this.loading = false;
      }
    });
  }
}
