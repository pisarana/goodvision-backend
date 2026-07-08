import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ClientesApplication } from '../../../core/application/clientes.application';
import { VentasApplication } from '../../../core/application/ventas.application';
import { MedidasApplication } from '../../../core/application/medidas.application';
import { Cliente } from '../../../core/domain/models/cliente.model';
import { Venta } from '../../../core/domain/models/venta.model';
import { EvaluacionMedida } from '../../../core/domain/models/medida.model';

const SOLO_LETRAS = Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/);
const SOLO_DIGITOS_9 = Validators.pattern(/^[0-9]{9}$/);
const DOC_PATTERN = Validators.pattern(/^[0-9]{8,12}$/);

@Component({
  selector: 'gv-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.css'
})
export class ClientesPageComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'error';
  searchTerm = '';

  reporteCliente: Cliente | null = null;
  reporteVentas: Venta[] = [];
  reporteMedidas: EvaluacionMedida[] = [];
  loadingReporte = false;

  readonly form = this.formBuilder.group({
    idCliente: this.formBuilder.control<number | null>(null),
    nombre:    this.formBuilder.nonNullable.control('', [Validators.required, SOLO_LETRAS, Validators.maxLength(60)]),
    apellido:  this.formBuilder.nonNullable.control('', [Validators.required, SOLO_LETRAS, Validators.maxLength(60)]),
    documento: this.formBuilder.nonNullable.control('', [Validators.required, DOC_PATTERN]),
    telefono:  this.formBuilder.nonNullable.control('', [SOLO_DIGITOS_9]),
    direccion: this.formBuilder.nonNullable.control(''),
    correo:    this.formBuilder.nonNullable.control('', [Validators.email])
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clientesApplication: ClientesApplication,
    private readonly ventasApplication: VentasApplication,
    private readonly medidasApplication: MedidasApplication
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(term = this.searchTerm): void {
    this.loading = true;
    this.message = '';
    this.clientesApplication.list(term).subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message = err.message || 'No se pudo cargar clientes.';
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; }, 6000);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const cliente: Cliente = {
      idCliente: value.idCliente ?? undefined,
      nombre: value.nombre,
      apellido: value.apellido,
      documento: value.documento,
      telefono: value.telefono,
      direccion: value.direccion,
      correo: value.correo
    };
    this.loading = true;
    this.clientesApplication.save(cliente).subscribe({
      next: () => {
        this.showMessage('Cliente guardado exitosamente.', 'success');
        this.reset();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        const status = err?.status;
        if (status === 409) {
          this.showMessage('Ya existe un cliente con ese documento.', 'error');
        } else {
          this.showMessage(err?.error?.message || err?.message || 'No se pudo guardar el cliente.', 'error');
        }
      }
    });
  }

  edit(cliente: Cliente): void {
    this.message = '';
    this.form.patchValue({
      idCliente: cliente.idCliente ?? null,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      documento: cliente.documento,
      telefono: cliente.telefono ?? '',
      direccion: cliente.direccion ?? '',
      correo: cliente.correo ?? ''
    });
  }

  remove(cliente: Cliente): void {
    if (!cliente.idCliente || !confirm(`Eliminar ${cliente.nombre} ${cliente.apellido}?`)) {
      return;
    }

    this.loading = true;
    this.clientesApplication.delete(cliente.idCliente).subscribe({
      next: () => {
        this.showMessage('Cliente eliminado exitosamente.', 'success');
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err?.error?.message || err?.message || 'No se pudo eliminar el cliente.', 'error');
      }
    });
  }

  verReporte(cliente: Cliente): void {
    if (!cliente.idCliente) return;
    this.reporteCliente = cliente;
    this.loadingReporte = true;
    this.reporteVentas = [];
    this.reporteMedidas = [];
    forkJoin({
      ventas: this.ventasApplication.findByCliente(cliente.idCliente),
      medidas: this.medidasApplication.findByCliente(cliente.idCliente)
    }).subscribe({
      next: ({ ventas, medidas }) => {
        this.reporteVentas = ventas;
        this.reporteMedidas = medidas;
        this.loadingReporte = false;
      },
      error: () => {
        this.loadingReporte = false;
        this.showMessage('No se pudo cargar el reporte del cliente.', 'error');
      }
    });
  }

  cerrarReporte(): void {
    this.reporteCliente = null;
    this.reporteVentas = [];
    this.reporteMedidas = [];
  }

  reset(): void {
    this.form.reset({
      idCliente: null,
      nombre: '',
      apellido: '',
      documento: '',
      telefono: '',
      direccion: '',
      correo: ''
    });
  }
}
