import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosApplication } from '../../../core/application/productos.application';
import { CategoriasApplication } from '../../../core/application/categorias.application';
import { Producto, Categoria } from '../../../core/domain/models/producto.model';

@Component({
  selector: 'gv-productos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
export class ProductosPageComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  searchTerm = '';

  readonly form = this.formBuilder.group({
    idProducto: this.formBuilder.control<number | null>(null),
    nombreProducto: this.formBuilder.nonNullable.control('', Validators.required),
    precio: this.formBuilder.nonNullable.control(0, [Validators.required, Validators.min(0.01)]),
    idCategoria: this.formBuilder.nonNullable.control<number>(0, [Validators.required, Validators.min(1)])
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productosApplication: ProductosApplication,
    private readonly categoriasApplication: CategoriasApplication
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.load();
  }

  loadCategorias(): void {
    this.categoriasApplication.list().subscribe({
      next: (cats) => { this.categorias = cats; }
    });
  }

  load(term = this.searchTerm): void {
    this.loading = true;
    this.productosApplication.list(term).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo cargar productos.', 'error');
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showMessage('Completa todos los campos obligatorios correctamente.', 'error');
      return;
    }

    const value = this.form.getRawValue();
    const producto: Producto = {
      idProducto: value.idProducto ?? undefined,
      nombreProducto: value.nombreProducto,
      precio: Number(value.precio),
      categoria: { idCategoria: Number(value.idCategoria) }
    };

    this.loading = true;
    this.productosApplication.save(producto).subscribe({
      next: () => {
        this.showMessage(
          value.idProducto ? 'Producto actualizado.' : 'Producto registrado.',
          'success'
        );
        this.reset();
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo guardar el producto.', 'error');
      }
    });
  }

  edit(producto: Producto): void {
    this.form.patchValue({
      idProducto: producto.idProducto ?? null,
      nombreProducto: producto.nombreProducto,
      precio: Number(producto.precio),
      idCategoria: producto.categoria?.idCategoria ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(producto: Producto): void {
    if (!producto.idProducto || !confirm(`¿Eliminar "${producto.nombreProducto}"? Esta acción no se puede deshacer.`)) return;
    this.loading = true;
    this.productosApplication.delete(producto.idProducto).subscribe({
      next: () => {
        this.showMessage('Producto eliminado.', 'success');
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo eliminar el producto.', 'error');
      }
    });
  }

  reset(): void {
    this.form.reset({ idProducto: null, nombreProducto: '', precio: 0, idCategoria: 0 });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 5000);
  }
}
