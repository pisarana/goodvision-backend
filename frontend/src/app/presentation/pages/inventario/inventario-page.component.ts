import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventarioApplication } from '../../../core/application/inventario.application';
import { ProductosApplication } from '../../../core/application/productos.application';
import { Inventario } from '../../../core/domain/models/inventario.model';
import { Producto } from '../../../core/domain/models/producto.model';

@Component({
  selector: 'gv-inventario-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventario-page.component.html',
  styleUrl: './inventario-page.component.css'
})
export class InventarioPageComponent implements OnInit {
  inventario: Inventario[] = [];
  productos: Producto[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'error';
  searchTerm = '';

  readonly form = this.formBuilder.group({
    idInventario: this.formBuilder.control<number | null>(null),
    idProducto: this.formBuilder.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    stock: this.formBuilder.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    stockMinimo: this.formBuilder.nonNullable.control(5, [Validators.required, Validators.min(0)])
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly inventarioApplication: InventarioApplication,
    private readonly productosApplication: ProductosApplication
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.load();
  }

  get totalStock(): number {
    return this.inventario.reduce((total, item) => total + Number(item.stock || 0), 0);
  }

  get bajoStock(): number {
    return this.inventario.filter((item) => Number(item.stock || 0) <= Number(item.stockMinimo || 0)).length;
  }

  get valorInventario(): number {
    return this.inventario.reduce(
      (total, item) => total + Number(item.stock || 0) * Number(item.producto?.precio || 0),
      0
    );
  }

  load(term = this.searchTerm): void {
    this.loading = true;
    this.message = '';
    this.inventarioApplication.list(term).subscribe({
      next: (inventario) => {
        this.inventario = inventario;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message = err.message || 'No se pudo cargar el inventario.';
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
    const inventario: Inventario = {
      idInventario: value.idInventario ?? undefined,
      producto: {
        idProducto: Number(value.idProducto),
        nombreProducto: '',
        precio: 0,
        categoria: { idCategoria: 1 }
      },
      stock: Number(value.stock),
      stockMinimo: Number(value.stockMinimo)
    };

    this.loading = true;
    this.inventarioApplication.save(inventario).subscribe({
      next: () => {
        this.showMessage('Inventario guardado exitosamente.', 'success');
        this.reset();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        const status = err?.status;
        if (status === 409) {
          this.showMessage('Ya existe un registro de inventario para ese producto.', 'error');
        } else {
          this.showMessage(err?.error?.message || err?.message || 'No se pudo guardar el inventario.', 'error');
        }
      }
    });
  }

  edit(item: Inventario): void {
    this.message = '';
    this.form.patchValue({
      idInventario: item.idInventario ?? null,
      idProducto: item.producto?.idProducto ?? 0,
      stock: Number(item.stock),
      stockMinimo: Number(item.stockMinimo)
    });
  }

  remove(item: Inventario): void {
    if (!item.idInventario || !confirm(`Eliminar inventario de ${item.producto?.nombreProducto}?`)) {
      return;
    }

    this.loading = true;
    this.inventarioApplication.delete(item.idInventario).subscribe({
      next: () => {
        this.showMessage('Registro de inventario eliminado.', 'success');
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err?.error?.message || err?.message || 'No se pudo eliminar el inventario.', 'error');
      }
    });
  }

  reset(): void {
    this.form.reset({
      idInventario: null,
      idProducto: 0,
      stock: 0,
      stockMinimo: 5
    });
  }

  estado(item: Inventario): string {
    return Number(item.stock || 0) <= Number(item.stockMinimo || 0) ? 'Reponer' : 'Disponible';
  }

  private loadProductos(): void {
    this.productosApplication.list().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (err) => {
        this.showMessage(err.message || 'No se pudo cargar la lista de productos.', 'error');
      }
    });
  }
}
