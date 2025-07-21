import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Categoria, CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-nvo-cat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nvo.cat.component.html',
  styleUrls: ['./nvo.cat.component.css']
})
export class NvoCatComponent implements OnInit {
  nuevaCategoria = {
    codigo: '',
    nombre: '',
    descripcion: '',
    requiere_refrigeracion: false,
    requiere_control_caducidad: false,
    categoria_padre_id: null as number | null
  };

  cargando = false;
  error: string | null = null;
  exito: string | null = null;

  categoriasPadre: Categoria[] = [];
  cargandoCategorias = true;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarCategoriasPadre();
  }

  async cargarCategoriasPadre(): Promise<void> {
    try {
      this.cargandoCategorias = true;
      this.categoriasPadre = await this.categoriaService.getCategorias();
    } catch (error) {
      console.error('Error al cargar categorías padre:', error);
    } finally {
      this.cargandoCategorias = false;
    }
  }

  async crearCategoria(): Promise<void> {
    if (!this.nuevaCategoria.codigo.trim()) {
      this.error = 'El código es requerido';
      return;
    }

    if (!this.nuevaCategoria.nombre.trim()) {
      this.error = 'El nombre es requerido';
      return;
    }

    try {
      this.cargando = true;
      this.error = null;
      this.exito = null;

      const categoriaData = {
        codigo: this.nuevaCategoria.codigo.trim(),
        nombre: this.nuevaCategoria.nombre.trim(),
        descripcion: this.nuevaCategoria.descripcion.trim() || undefined,
        requiere_refrigeracion: this.nuevaCategoria.requiere_refrigeracion,
        requiere_control_caducidad: this.nuevaCategoria.requiere_control_caducidad,
        categoria_padre_id: this.nuevaCategoria.categoria_padre_id !== null ? this.nuevaCategoria.categoria_padre_id : undefined
      };

      await this.categoriaService.crearCategoria(categoriaData);

      this.exito = 'Categoría creada exitosamente';
      this.limpiarFormulario();

      setTimeout(() => {
        this.router.navigate(['/categorias']);
      }, 2000);

    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      this.error = error.response?.data?.error || 'Error al crear la categoría';
    } finally {
      this.cargando = false;
    }
  }

  limpiarFormulario(): void {
    this.nuevaCategoria = {
      codigo: '',
      nombre: '',
      descripcion: '',
      requiere_refrigeracion: false,
      requiere_control_caducidad: false,
      categoria_padre_id: null
    };
  }

  cancelar(): void {
    this.router.navigate(['/categorias']);
  }

  onInputChange(): void {
    if (this.error) this.error = null;
    if (this.exito) this.exito = null;
  }
}
