import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasApplication } from '../../../core/application/categorias.application';
import { Categoria } from '../../../core/domain/models/producto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gv-categorias-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categorias-page.component.html',
  styleUrls: ['./categorias-page.component.css']
})
export class CategoriasPageComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  saving = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  editingId: number | null = null;
  searchTerm = '';

  readonly categoriaForm = inject(FormBuilder).group({
    nombreCategoria: ['', [Validators.required, Validators.maxLength(100)]]
  });

  constructor(private readonly categoriasApplication: CategoriasApplication) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading = true;
    this.categoriasApplication.list().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.message || 'No se pudo cargar las categorías.', 'error');
      }
    });
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const value = this.categoriaForm.getRawValue();
    const categoria: Categoria = {
      idCategoria: this.editingId ?? 0,
      nombreCategoria: value.nombreCategoria ?? ''
    };

    this.saving = true;
    this.message = '';

    const operation = this.editingId
      ? this.categoriasApplication.update(this.editingId, categoria)
      : this.categoriasApplication.save(categoria);

    operation.subscribe({
      next: () => {
        this.showMessage(
          this.editingId ? 'Categoría actualizada exitosamente.' : 'Categoría registrada exitosamente.',
          'success'
        );
        this.limpiarFormulario();
        this.loadCategorias();
      },
      error: (err) => {
        this.saving = false;
        this.showMessage(err.message || 'No se pudo guardar la categoría.', 'error');
      }
    });
  }

  editarCategoria(categoria: Categoria): void {
    this.editingId = categoria.idCategoria ?? null;
    this.categoriaForm.patchValue({
      nombreCategoria: categoria.nombreCategoria || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarCategoria(categoria: Categoria): void {
    if (!categoria.idCategoria) {
      const errorMsg = 'Error: ID de categoría no encontrado.';
      console.error(errorMsg, categoria);
      this.showMessage(errorMsg, 'error');
      return;
    }

    if (!confirm(`¿Eliminar la categoría "${categoria.nombreCategoria}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.loading = true;
    this.categoriasApplication.delete(categoria.idCategoria).subscribe({
      next: () => {
        this.showMessage('Categoría eliminada exitosamente.', 'success');
        this.loadCategorias();
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || err.message || 'No se pudo eliminar la categoría.';
        console.error('Error al eliminar categoría:', err);
        this.showMessage(errorMsg, 'error');
      }
    });
  }

  limpiarFormulario(): void {
    this.categoriaForm.reset();
    this.editingId = null;
    this.saving = false;
  }

  filtrarCategorias(): Categoria[] {
    if (!this.searchTerm) return this.categorias;
    const term = this.searchTerm.toLowerCase();
    return this.categorias.filter(c =>
      c.nombreCategoria?.toLowerCase().includes(term)
    );
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 5000);
  }
}
