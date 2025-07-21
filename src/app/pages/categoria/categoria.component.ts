import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CategoriaService, Categoria } from '../../core/services/categoria.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

interface Estadisticas {
  total: number;
  activas: number;
  inactivas: number;
  conRefrigeracion: number;
  conControlCaducidad: number;
}

interface FiltrosCategoria {
  texto: string;
  estado: 'todas' | 'activas' | 'inactivas';
  refrigeracion: 'todas' | 'si' | 'no';
  caducidad: 'todas' | 'si' | 'no';
}

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit, OnDestroy {

  // Servicios
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Subject para cleanup
  private destroy$ = new Subject<void>();
  
  // Subject para búsqueda con debounce
  private filtroTextoSubject = new BehaviorSubject<string>('');

  // Datos consolidados
  todasCategorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

  // Estados
  cargando = false;
  error: string | null = null;

  // Filtros mejorados con tipado
  filtros: FiltrosCategoria = {
    texto: '',
    estado: 'todas',
    refrigeracion: 'todas',
    caducidad: 'todas'
  };

  // Getters para template
  get filtroTexto(): string { return this.filtros.texto; }
  set filtroTexto(value: string) { 
    this.filtros.texto = value;
    this.filtroTextoSubject.next(value);
  }

  get filtroEstado() { return this.filtros.estado; }
  set filtroEstado(value: 'todas' | 'activas' | 'inactivas') { 
    this.filtros.estado = value;
    this.aplicarFiltros();
  }

  get filtroRefrigeracion() { return this.filtros.refrigeracion; }
  set filtroRefrigeracion(value: 'todas' | 'si' | 'no') { 
    this.filtros.refrigeracion = value;
    this.aplicarFiltros();
  }

  get filtroCaducidad() { return this.filtros.caducidad; }
  set filtroCaducidad(value: 'todas' | 'si' | 'no') { 
    this.filtros.caducidad = value;
    this.aplicarFiltros();
  }

  ngOnInit(): void {
    this.inicializarComponente();
    this.configurarBusquedaDebounced();
    this.configurarNavegacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarComponente(): void {
    this.cargarTodasCategorias();
  }

  private configurarBusquedaDebounced(): void {
    this.filtroTextoSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.aplicarFiltros();
    });
  }

  private configurarNavegacion(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cargarTodasCategorias();
    });
  }

  async cargarTodasCategorias(): Promise<void> {
    if (this.cargando) return; // Prevenir múltiples llamadas simultáneas
    
    this.cargando = true;
    this.error = null;

    try {
      const [activas, inactivas] = await Promise.allSettled([
        this.categoriaService.getCategorias(),
        this.categoriaService.getCategoriasDesactivadas()
      ]);

      const categoriasActivas = activas.status === 'fulfilled' ? activas.value : [];
      const categoriasInactivas = inactivas.status === 'fulfilled' ? inactivas.value : [];

      if (activas.status === 'rejected' || inactivas.status === 'rejected') {
        console.warn('Error parcial al cargar categorías:', { activas, inactivas });
      }

      this.todasCategorias = [...categoriasActivas, ...categoriasInactivas];
      this.aplicarFiltros();
      
    } catch (err) {
      this.manejarError('Error al cargar las categorías. Intenta de nuevo.', err);
    } finally {
      this.cargando = false;
    }
  }

  aplicarFiltros(): void {
    let resultado = [...this.todasCategorias];

    // Aplicar filtros en secuencia para mejor performance
    resultado = this.aplicarFiltroTexto(resultado);
    resultado = this.aplicarFiltroEstado(resultado);
    resultado = this.aplicarFiltroRefrigeracion(resultado);
    resultado = this.aplicarFiltroCaducidad(resultado);

    this.categoriasFiltradas = resultado;
  }

  private aplicarFiltroTexto(categorias: Categoria[]): Categoria[] {
    if (!this.filtros.texto.trim()) return categorias;
    
    const texto = this.filtros.texto.toLowerCase().trim();
    return categorias.filter(cat =>
      cat.nombre.toLowerCase().includes(texto) ||
      cat.codigo.toLowerCase().includes(texto) ||
      (cat.descripcion?.toLowerCase().includes(texto) ?? false)
    );
  }

  private aplicarFiltroEstado(categorias: Categoria[]): Categoria[] {
    if (this.filtros.estado === 'todas') return categorias;
    
    return categorias.filter(cat =>
      this.filtros.estado === 'activas' ? cat.activo : !cat.activo
    );
  }

  private aplicarFiltroRefrigeracion(categorias: Categoria[]): Categoria[] {
    if (this.filtros.refrigeracion === 'todas') return categorias;
    
    return categorias.filter(cat =>
      this.filtros.refrigeracion === 'si' ? cat.requiere_refrigeracion : !cat.requiere_refrigeracion
    );
  }

  private aplicarFiltroCaducidad(categorias: Categoria[]): Categoria[] {
    if (this.filtros.caducidad === 'todas') return categorias;
    
    return categorias.filter(cat =>
      this.filtros.caducidad === 'si' ? cat.requiere_control_caducidad : !cat.requiere_control_caducidad
    );
  }

  // Métodos de navegación
  irANuevaCategoria(): void {
    this.router.navigate(['/categorias/nuevo']);
  }

  irAEditarCategoria(id: number): void {
    this.router.navigate(['/categorias/editar', id]);
  }

  // Métodos de manipulación de datos
  async confirmarEliminacion(categoria: Categoria): Promise<void> {
    const mensaje = `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
      await this.eliminarCategoria(categoria.id);
    }
  }

  async eliminarCategoria(id: number): Promise<void> {
    const categoriaAEliminar = this.todasCategorias.find(c => c.id === id);
    if (!categoriaAEliminar) {
      this.mostrarError('Categoría no encontrada');
      return;
    }

    this.cargando = true;
    this.error = null;

    try {
      await this.categoriaService.eliminarCategoria(id);
      
      // Actualizar localmente para mejor UX
      this.todasCategorias = this.todasCategorias.filter(c => c.id !== id);
      this.aplicarFiltros();
      
      this.mostrarExito(`Categoría "${categoriaAEliminar.nombre}" eliminada correctamente`);
    } catch (err) {
      this.manejarError('No se pudo eliminar. Puede que esté siendo usada por productos.', err);
    } finally {
      this.cargando = false;
    }
  }

  async cambiarEstadoCategoria(categoria: Categoria): Promise<void> {
    const nuevoEstado = !categoria.activo;
    const categoriaActualizada: Categoria = { ...categoria, activo: nuevoEstado };

    try {
      await this.categoriaService.actualizarCategoria(categoria.id, categoriaActualizada);

      // Actualizar optimistamente en la UI
      const index = this.todasCategorias.findIndex(c => c.id === categoria.id);
      if (index !== -1) {
        this.todasCategorias[index] = categoriaActualizada;
        this.aplicarFiltros();
      }

      const accion = nuevoEstado ? 'activada' : 'desactivada';
      this.mostrarExito(`Categoría "${categoria.nombre}" ${accion} correctamente`);

    } catch (err) {
      this.manejarError(`Error al ${nuevoEstado ? 'activar' : 'desactivar'} la categoría.`, err);
    }
  }

  // Métodos de utilidad
  exportarCSV(): void {
    if (this.categoriasFiltradas.length === 0) {
      this.mostrarError('No hay datos para exportar');
      return;
    }

    try {
      const datos = this.prepararDatosCSV();
      this.descargarCSV(datos);
      this.mostrarExito(`CSV exportado con ${this.categoriasFiltradas.length} categorías`);
    } catch (err) {
      this.manejarError('Error al exportar CSV', err);
    }
  }

  private prepararDatosCSV(): string {
    const headers = ['ID', 'Código', 'Nombre', 'Descripción', 'Refrigeración', 'Control Caducidad', 'Estado'];
    
    const filas = this.categoriasFiltradas.map(cat => [
      cat.id.toString(),
      cat.codigo,
      cat.nombre,
      cat.descripcion || '',
      cat.requiere_refrigeracion ? 'Sí' : 'No',
      cat.requiere_control_caducidad ? 'Sí' : 'No',
      cat.activo ? 'Activa' : 'Inactiva'
    ]);

    return [headers, ...filas]
      .map(fila => fila.map(campo => `"${campo.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  private descargarCSV(contenido: string): void {
    const blob = new Blob(['\ufeff' + contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `categorias_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL para liberar memoria
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  limpiarFiltros(): void {
    this.filtros = {
      texto: '',
      estado: 'todas',
      refrigeracion: 'todas',
      caducidad: 'todas'
    };
    this.filtroTextoSubject.next('');
    this.aplicarFiltros();
  }

  getEstadisticas(): Estadisticas {
    const categorias = this.todasCategorias;
    
    return {
      total: categorias.length,
      activas: categorias.filter(c => c.activo).length,
      inactivas: categorias.filter(c => !c.activo).length,
      conRefrigeracion: categorias.filter(c => c.requiere_refrigeracion).length,
      conControlCaducidad: categorias.filter(c => c.requiere_control_caducidad).length
    };
  }

  // Helper method para contar categorías filtradas por estado (usado en template)
  contarCategoriasFiltradas(tipo: 'activas' | 'inactivas'): number {
    return this.categoriasFiltradas.filter(c => 
      tipo === 'activas' ? c.activo : !c.activo
    ).length;
  }

  trackByCategoria(index: number, categoria: Categoria): number {
    return categoria.id;
  }

  // Métodos de manejo de errores y notificaciones
  private manejarError(mensaje: string, error?: any): void {
    this.error = mensaje;
    this.mostrarError(mensaje);
    if (error) {
      console.error('Error en CategoriaComponent:', error);
    }
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}