import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedidasApplication } from '../../../core/application/medidas.application';
import { ClientesApplication } from '../../../core/application/clientes.application';
import { AuthApplication } from '../../../core/application/auth.application';
import { EvaluacionMedida, DetalleMedidaRequest } from '../../../core/domain/models/medida.model';
import { Cliente } from '../../../core/domain/models/cliente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gv-medidas-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medidas-page.component.html',
  styleUrl: './medidas-page.component.css'
})
export class MedidasPageComponent implements OnInit {
  evaluaciones: EvaluacionMedida[] = [];
  clientes: Cliente[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  searchTerm = '';
  isAdmin = false;

  selectedCliente: Cliente | null = null;
  tipoEvaluacion: string = 'REFRACCION';
  observaciones: string = '';

  // Medidas Ojo Derecho
  odEsfera: number | null = null;
  odCilindro: number | null = null;
  odEje: number | null = null;

  // Medidas Ojo Izquierdo
  oiEsfera: number | null = null;
  oiCilindro: number | null = null;
  oiEje: number | null = null;

  tiposEvaluacion = [
    'REFRACCION',
    'OPTOMETRIA',
    'REVISION',
    'CONTROL',
    'GRADUACION INICIAL'
  ];

  constructor(
    private readonly medidasApplication: MedidasApplication,
    private readonly clientesApplication: ClientesApplication,
    private readonly authApplication: AuthApplication
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authApplication.isAdmin();
    this.loadEvaluaciones();
    this.loadClientes();
  }

  loadEvaluaciones(): void {
    this.loading = true;
    this.medidasApplication.list().subscribe({
      next: (evaluaciones) => {
        this.evaluaciones = evaluaciones;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage('Error al cargar evaluaciones: ' + (err.message || ''), 'error');
      }
    });
  }

  loadClientes(): void {
    this.clientesApplication.list().subscribe({
      next: (clientes) => { this.clientes = clientes; },
      error: () => {}
    });
  }

  guardarEvaluacion(): void {
    if (!this.selectedCliente) {
      this.showMessage('Selecciona un paciente', 'error');
      return;
    }

    // Obtener userId del storage (del login actual)
    const userId = this.authApplication.getCurrentUserId();
    if (!userId) {
      this.showMessage('Error de sesión: no se encontró el usuario. Por favor inicia sesión nuevamente.', 'error');
      return;
    }

    const tieneOD = this.odEsfera !== null || this.odCilindro !== null || this.odEje !== null;
    const tieneOI = this.oiEsfera !== null || this.oiCilindro !== null || this.oiEje !== null;

    if (!tieneOD && !tieneOI) {
      this.showMessage('Ingresa al menos las medidas de un ojo', 'error');
      return;
    }

    const detalles: DetalleMedidaRequest[] = [];

    if (tieneOD) {
      detalles.push({
        ojo: 'OJO_DERECHO',
        esfera: this.odEsfera,
        cilindro: this.odCilindro,
        eje: this.odEje
      });
    }

    if (tieneOI) {
      detalles.push({
        ojo: 'OJO_IZQUIERDO',
        esfera: this.oiEsfera,
        cilindro: this.oiCilindro,
        eje: this.oiEje
      });
    }

    const evaluacionRequest = {
      idUsuario: userId,
      idCliente: this.selectedCliente.idCliente!,
      tipoEvaluacion: this.tipoEvaluacion,
      observaciones: this.observaciones || undefined,
      detalles
    };

    this.loading = true;
    this.message = '';

    this.medidasApplication.save(evaluacionRequest).subscribe({
      next: () => {
        this.showMessage('¡Evaluación registrada exitosamente!', 'success');
        this.limpiarFormulario();
        this.loadEvaluaciones();
      },
      error: (err) => {
        this.loading = false;
        const msg = err.message || 'Error al guardar la evaluación';
        this.showMessage(msg, 'error');
      }
    });
  }

  limpiarFormulario(): void {
    this.selectedCliente = null;
    this.tipoEvaluacion = 'REFRACCION';
    this.observaciones = '';
    this.odEsfera = null;
    this.odCilindro = null;
    this.odEje = null;
    this.oiEsfera = null;
    this.oiCilindro = null;
    this.oiEje = null;
    this.loading = false;
  }

  eliminarEvaluacion(evaluacion: EvaluacionMedida): void {
    if (!evaluacion.idEvaluacion) return;
    if (!confirm(`¿Eliminar evaluación #${evaluacion.idEvaluacion} de ${evaluacion.cliente.nombre}?`)) return;

    this.loading = true;
    this.medidasApplication.delete(evaluacion.idEvaluacion).subscribe({
      next: () => {
        this.showMessage('Evaluación eliminada exitosamente.', 'success');
        this.loadEvaluaciones();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'Error al eliminar evaluación', 'error');
      }
    });
  }

  getDetallePorOjo(evaluacion: EvaluacionMedida, ojo: string): string {
    const detalle = evaluacion.detalles?.find(d => d.ojo === ojo);
    if (!detalle) return '—';

    const parts = [];
    if (detalle.esfera !== null && detalle.esfera !== undefined) {
      const signo = (detalle.esfera as number) >= 0 ? '+' : '';
      parts.push(`Esf: ${signo}${(detalle.esfera as number).toFixed(2)}`);
    }
    if (detalle.cilindro !== null && detalle.cilindro !== undefined) {
      const signo = (detalle.cilindro as number) >= 0 ? '+' : '';
      parts.push(`Cil: ${signo}${(detalle.cilindro as number).toFixed(2)}`);
    }
    if (detalle.eje !== null && detalle.eje !== undefined) {
      parts.push(`Eje: ${detalle.eje}°`);
    }

    return parts.length > 0 ? parts.join(' | ') : '—';
  }

  expandedId: number | null = null;

  toggleDetalle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  filtrarEvaluaciones(): EvaluacionMedida[] {
    if (!this.searchTerm) return this.evaluaciones;
    const term = this.searchTerm.toLowerCase();
    return this.evaluaciones.filter(e =>
      e.cliente.nombre.toLowerCase().includes(term) ||
      e.cliente.apellido.toLowerCase().includes(term) ||
      e.cliente.documento.toLowerCase().includes(term)
    );
  }

  onClienteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idCliente = +target.value;
    this.selectedCliente = this.clientes.find(c => c.idCliente === idCliente) || null;
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 5000);
  }
}
