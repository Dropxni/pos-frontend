import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria, CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-act-cat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './act.cat.component.html',
  styleUrls: ['./act.cat.component.css']  // corregido aquí, debe ser styleUrls (plural)
})
export class ActCatComponent implements OnInit {
  categoriaForm: FormGroup;
  categoriaId: number | null = null;
  categorias: Categoria[] = [];
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      requiere_refrigeracion: [false],
      requiere_control_caducidad: [false],
      categoria_padre_id: [null],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.categoriaId = idParam ? Number(idParam) : null;

    if (this.categoriaId && !isNaN(this.categoriaId)) {
      this.loadCategoria();
    }
    this.loadCategorias();
  }

  async loadCategoria(): Promise<void> {
    if (!this.categoriaId) return;

    this.isLoading = true;
    this.error = null;

    try {
      const categoria = await this.categoriaService.getCategoriaById(this.categoriaId);

      // Asegúrate que categoria_padre_id sea undefined o number
      if (!categoria.categoria_padre_id) {
        categoria.categoria_padre_id = undefined;
      }

      this.categoriaForm.patchValue(categoria);
    } catch (error) {
      this.error = 'Error al cargar la categoría';
      console.error('Error loading categoria:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadCategorias(): Promise<void> {
    try {
      this.categorias = await this.categoriaService.getCategorias();
      if (this.categoriaId) {
        this.categorias = this.categorias.filter(cat => cat.id !== this.categoriaId);
      }
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.categoriaForm.invalid || !this.categoriaId) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    try {
      const formData = this.categoriaForm.value;

      // Convertir categoria_padre_id a null si está vacío o 0
      if (!formData.categoria_padre_id || formData.categoria_padre_id === '0') {
        formData.categoria_padre_id = null;
      } else if (typeof formData.categoria_padre_id === 'string') {
        // Convertir string a número si viene como string
        formData.categoria_padre_id = Number(formData.categoria_padre_id);
      }

      await this.categoriaService.actualizarCategoria(this.categoriaId, formData);
      this.router.navigate(['/categorias']);
    } catch (error) {
      this.error = 'Error al actualizar la categoría';
      console.error('Error updating categoria:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/categorias']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoriaForm.controls).forEach(key => {
      const control = this.categoriaForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.categoriaForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName} es requerido`;
      }
      if (control.errors['minlength']) {
        return `${fieldName} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `${fieldName} no puede tener más de ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return null;
  }
}
