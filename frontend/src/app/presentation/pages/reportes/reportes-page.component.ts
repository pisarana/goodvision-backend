import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasApplication } from '../../../core/application/ventas.application';
import { ProductosApplication } from '../../../core/application/productos.application';
import { MedidasApplication } from '../../../core/application/medidas.application';
import { Venta } from '../../../core/domain/models/venta.model';
import { Producto } from '../../../core/domain/models/producto.model';
import { EvaluacionMedida } from '../../../core/domain/models/medida.model';

interface ProductoVendido {
  nombre: string;
  cantidadVendida: number;
  ingresos: number;
  categoria: string;
}

interface VentasPorMetodo {
  metodoPago: string;
  cantidad: number;
  total: number;
}

interface UltimaEvaluacion {
  fecha: string;
  cliente: string;
  especialista: string;
  odEsfera: number;
  odCilindro: number;
  oiEsfera: number;
  oiCilindro: number;
}

@Component({
  selector: 'gv-reportes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.css'
})
export class ReportesPageComponent implements OnInit {
  cargando = false;

  private todasLasVentas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  productos: Producto[] = [];
  evaluaciones: EvaluacionMedida[] = [];

  totalVentas = 0;
  cantidadVentas = 0;
  promedioVenta = 0;

  ventasPorMetodo: VentasPorMetodo[] = [];
  topProductos: ProductoVendido[] = [];
  ultimasEvaluaciones: UltimaEvaluacion[] = [];

  filtroActual: 'TODO' | 'MES' | 'SEMANA' | 'HOY' = 'TODO';

  constructor(
    private readonly ventasApplication: VentasApplication,
    private readonly productosApplication: ProductosApplication,
    private readonly medidasApplication: MedidasApplication
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    Promise.all([
      this.cargarVentas(),
      this.cargarProductos(),
      this.cargarEvaluaciones()
    ]).then(() => {
      this.aplicarFiltro(this.filtroActual);
      this.cargando = false;
    }).catch(() => {
      this.cargando = false;
    });
  }

  private cargarVentas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ventasApplication.list().subscribe({
        next: (ventas) => {
          this.todasLasVentas = ventas;
          resolve();
        },
        error: () => reject()
      });
    });
  }

  private cargarProductos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productosApplication.list().subscribe({
        next: (productos) => {
          this.productos = productos;
          resolve();
        },
        error: () => reject()
      });
    });
  }

  private cargarEvaluaciones(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.medidasApplication.list().subscribe({
        next: (evaluaciones) => {
          this.evaluaciones = evaluaciones;
          this.ultimasEvaluaciones = evaluaciones.slice(0, 10).map(e => {
            const od = e.detalles?.find(d => d.ojo === 'OJO_DERECHO');
            const oi = e.detalles?.find(d => d.ojo === 'OJO_IZQUIERDO');
            return {
              fecha: e.fechaEvaluacion,
              cliente: `${e.cliente.nombre} ${e.cliente.apellido}`,
              especialista: `${e.usuario.nombre}`,
              odEsfera: od?.esfera ?? 0,
              odCilindro: od?.cilindro ?? 0,
              oiEsfera: oi?.esfera ?? 0,
              oiCilindro: oi?.cilindro ?? 0
            };
          });
          resolve();
        },
        error: () => reject()
      });
    });
  }

  aplicarFiltro(periodo: 'TODO' | 'MES' | 'SEMANA' | 'HOY'): void {
    this.filtroActual = periodo;
    this.ventasFiltradas = this.filtrarPorPeriodo(this.todasLasVentas, periodo);
    this.calcularMetricas();
  }

  private filtrarPorPeriodo(ventas: Venta[], periodo: string): Venta[] {
    if (periodo === 'TODO') return ventas;

    const hoyStr = new Date().toISOString().slice(0, 10);

    return ventas.filter(v => {
      const fechaNorm = new Date(v.fechaVenta as unknown as string).toISOString().slice(0, 10);

      if (periodo === 'HOY') {
        return fechaNorm === hoyStr;
      }
      if (periodo === 'SEMANA') {
        const corteStr = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return fechaNorm >= corteStr;
      }
      if (periodo === 'MES') {
        const corteStr = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return fechaNorm >= corteStr;
      }
      return true;
    });
  }

  private calcularMetricas(): void {
    const ventas = this.ventasFiltradas;
    this.cantidadVentas = ventas.length;
    this.totalVentas = ventas.reduce((sum, v) => sum + Number(v.total), 0);
    this.promedioVenta = this.cantidadVentas > 0 ? this.totalVentas / this.cantidadVentas : 0;

    this.calcularVentasPorMetodo(ventas);
    this.calcularTopProductos(ventas);
  }

  private calcularVentasPorMetodo(ventas: Venta[]): void {
    const mapa: Record<string, { cantidad: number; total: number }> = {};

    ventas.forEach(v => {
      if (!mapa[v.metodoPago]) {
        mapa[v.metodoPago] = { cantidad: 0, total: 0 };
      }
      mapa[v.metodoPago].cantidad++;
      mapa[v.metodoPago].total += Number(v.total);
    });

    this.ventasPorMetodo = Object.entries(mapa)
      .map(([metodoPago, data]) => ({ metodoPago, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  private calcularTopProductos(ventas: Venta[]): void {
    const mapa = new Map<number, ProductoVendido>();

    ventas.forEach(venta => {
      venta.detalles?.forEach(detalle => {
        const id = detalle.producto?.idProducto;
        if (!id) return;
        const existing = mapa.get(id);
        if (existing) {
          existing.cantidadVendida += detalle.cantidad;
          existing.ingresos += Number(detalle.subtotal);
        } else {
          mapa.set(id, {
            nombre: detalle.producto.nombreProducto,
            cantidadVendida: detalle.cantidad,
            ingresos: Number(detalle.subtotal),
            categoria: detalle.producto.categoria?.nombreCategoria ?? ''
          });
        }
      });
    });

    this.topProductos = Array.from(mapa.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 10);
  }

  exportarCSV(): void {
    const headers = ['ID Venta', 'Fecha', 'Cliente', 'Metodo Pago', 'Total'];
    const rows = this.ventasFiltradas.map(v => [
      v.idVenta,
      new Date(v.fechaVenta).toLocaleDateString('es-PE'),
      `${v.cliente.nombre} ${v.cliente.apellido}`,
      v.metodoPago,
      Number(v.total).toFixed(2)
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ventas_${this.filtroActual}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportarPDF(): void {
    const contenido = this.generarContenidoPDF();
    const ventana = window.open('', '_blank');
    if (!ventana) return;
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  }

  private generarContenidoPDF(): string {
    const fecha = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

    const filasVentas = this.ventasFiltradas.map(v => `
      <tr>
        <td>#${v.idVenta}</td>
        <td>${v.fechaVenta}</td>
        <td>${v.cliente.nombre} ${v.cliente.apellido}</td>
        <td>${v.metodoPago}</td>
        <td style="text-align:right;font-weight:bold">S/ ${Number(v.total).toFixed(2)}</td>
      </tr>`).join('');

    const filasMedidas = this.ultimasEvaluaciones.map(e => `
      <tr>
        <td>${e.fecha}</td>
        <td>${e.cliente}</td>
        <td>${e.especialista}</td>
        <td style="text-align:center">${e.odEsfera > 0 ? '+' : ''}${e.odEsfera.toFixed(2)}</td>
        <td style="text-align:center">${e.odCilindro > 0 ? '+' : ''}${e.odCilindro.toFixed(2)}</td>
        <td style="text-align:center">${e.oiEsfera > 0 ? '+' : ''}${e.oiEsfera.toFixed(2)}</td>
        <td style="text-align:center">${e.oiCilindro > 0 ? '+' : ''}${e.oiCilindro.toFixed(2)}</td>
      </tr>`).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte GoodVision - ${fecha}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #2f241b; margin: 24px; background: #fff; }
    .logo-bar { display: flex; align-items: center; gap: 12px; border-bottom: 3px solid #ff8200; padding-bottom: 12px; margin-bottom: 20px; }
    .logo-bar h1 { color: #ff8200; margin: 0; font-size: 22px; }
    .logo-bar span { color: #8a7864; font-size: 13px; }
    .meta { color: #6f5f4f; margin-bottom: 20px; font-size: 11px; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric { border: 1px solid #f0dfca; border-radius: 8px; padding: 14px 18px; background: #fffaf4; }
    .metric .label { font-size: 10px; font-weight: 700; color: #8a7864; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .metric .value { font-size: 22px; font-weight: 900; color: #ff8200; }
    h2 { color: #2f241b; font-size: 14px; margin: 24px 0 8px; border-left: 4px solid #ff8200; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #ff8200; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; }
    td { padding: 7px 10px; border-bottom: 1px solid #f5e8d8; color: #2f241b; }
    tr:nth-child(even) td { background: #fffaf4; }
    .footer { margin-top: 40px; font-size: 10px; color: #8a7864; text-align: center; border-top: 1px solid #f0dfca; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="logo-bar">
    <h1>GoodVision</h1>
    <span>Óptica — Reporte de Ventas y Medidas</span>
  </div>
  <p class="meta">Periodo: <strong>${this.getPeriodoLabel()}</strong> &nbsp;|&nbsp; Generado: ${fecha}</p>

  <div class="metrics">
    <div class="metric"><div class="label">Total Ventas</div><div class="value">S/ ${this.totalVentas.toFixed(2)}</div></div>
    <div class="metric"><div class="label">N° Transacciones</div><div class="value">${this.cantidadVentas}</div></div>
    <div class="metric"><div class="label">Promedio por Venta</div><div class="value">S/ ${this.promedioVenta.toFixed(2)}</div></div>
  </div>

  <h2>Detalle de Ventas</h2>
  <table>
    <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Método Pago</th><th>Total</th></tr></thead>
    <tbody>${filasVentas || '<tr><td colspan="5" style="text-align:center;color:#8a7864;padding:20px">Sin ventas en el periodo seleccionado</td></tr>'}</tbody>
  </table>

  ${this.ultimasEvaluaciones.length > 0 ? `
  <h2>Evaluaciones de Medidas Ópticas</h2>
  <table>
    <thead>
      <tr>
        <th>Fecha</th><th>Cliente</th><th>Especialista</th>
        <th>OD Esfera</th><th>OD Cilindro</th><th>OI Esfera</th><th>OI Cilindro</th>
      </tr>
    </thead>
    <tbody>${filasMedidas}</tbody>
  </table>` : ''}

  <div class="footer">GoodVision Óptica &mdash; Reporte generado automáticamente &mdash; ${fecha}</div>
</body>
</html>`;
  }

  getPeriodoLabel(): string {
    const labels: Record<string, string> = {
      'TODO': 'Historico completo',
      'MES': 'Ultimo mes',
      'SEMANA': 'Ultima semana',
      'HOY': 'Hoy'
    };
    return labels[this.filtroActual] ?? 'Todos';
  }
}
