import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Proveedor, ProveedorService } from '../../core/services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  imports: [CommonModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm = '';
  selectedProveedor: Proveedor | null = null;
  showDeleteModal = false;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  async loadProveedores(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.proveedores = await this.proveedorService.getProveedores();
      this.proveedoresFiltrados = [...this.proveedores];
    } catch (error) {
      this.error = 'Error al cargar los proveedores';
      console.error('Error loading proveedores:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    
    if (this.searchTerm.trim() === '') {
      this.proveedoresFiltrados = [...this.proveedores];
    } else {
      this.proveedoresFiltrados = this.proveedores.filter(proveedor =>
        proveedor.razon_social.toLowerCase().includes(this.searchTerm) ||
        proveedor.codigo.toLowerCase().includes(this.searchTerm) ||
        proveedor.nombre_contacto.toLowerCase().includes(this.searchTerm) ||
        (proveedor.rfc && proveedor.rfc.toLowerCase().includes(this.searchTerm))
      );
    }
  }

  onNuevoProveedor(): void {
    this.router.navigate(['/proveedores/nuevo']);
  }

  onEditarProveedor(proveedor: Proveedor): void {
    this.router.navigate(['/proveedores/editar', proveedor.id]);
  }

  onEliminarProveedor(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;
    this.showDeleteModal = true;
  }

  async confirmarEliminacion(): Promise<void> {
    if (!this.selectedProveedor) return;

    try {
      await this.proveedorService.eliminarProveedor(this.selectedProveedor.id);
      this.showDeleteModal = false;
      this.selectedProveedor = null;
      await this.loadProveedores();
    } catch (error) {
      this.error = 'Error al eliminar el proveedor';
      console.error('Error deleting proveedor:', error);
    }
  }

  cancelarEliminacion(): void {
    this.showDeleteModal = false;
    this.selectedProveedor = null;
  }

  onVerDetalle(proveedor: Proveedor): void {
    this.router.navigate(['/proveedores/detalle', proveedor.id]);
  }

  formatearLimiteCredito(limite: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(limite);
  }

  getDiasCredito(dias: number): string {
    if (dias === 0) return 'Contado';
    if (dias === 1) return '1 día';
    return `${dias} días`;
  }
}