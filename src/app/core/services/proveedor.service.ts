import { Injectable } from '@angular/core';
import axiosInstance from './axios-instance';
import { AuthService } from './auth.service';

export interface Proveedor {
  id: number;
  codigo: string;
  razon_social: string;
  nombre_contacto: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rfc?: string;
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  
  constructor(private authService: AuthService) {}

  async getProveedores(): Promise<Proveedor[]> {
    const res = await axiosInstance.get('/proveedores');
    return res.data.proveedores;
  }

  async getProveedorById(id: number): Promise<Proveedor> {
    const res = await axiosInstance.get(`/proveedores/${id}`);
    return res.data;
  }

  async crearProveedor(data: Partial<Proveedor>): Promise<Proveedor> {
    const res = await axiosInstance.post('/proveedores', data);
    return res.data;
  }

  async actualizarProveedor(id: number, data: Partial<Proveedor>): Promise<Proveedor> {
    const res = await axiosInstance.put(`/proveedores/${id}`, data);
    return res.data;
  }

  async eliminarProveedor(id: number): Promise<{ mensaje: string }> {
    const res = await axiosInstance.delete(`/proveedores/${id}`);
    return res.data;
  }

  // Métodos de utilidad adicionales que podrías necesitar
  async buscarProveedores(termino: string): Promise<Proveedor[]> {
    const proveedores = await this.getProveedores();
    return proveedores.filter(proveedor => 
      proveedor.razon_social.toLowerCase().includes(termino.toLowerCase()) ||
      proveedor.codigo.toLowerCase().includes(termino.toLowerCase()) ||
      proveedor.nombre_contacto.toLowerCase().includes(termino.toLowerCase())
    );
  }

  async validarCodigo(codigo: string, proveedorId?: number): Promise<boolean> {
    try {
      const proveedores = await this.getProveedores();
      return !proveedores.some(proveedor => 
        proveedor.codigo === codigo && proveedor.id !== proveedorId
      );
    } catch (error) {
      console.error('Error al validar código:', error);
      return false;
    }
  }

  async validarRFC(rfc: string, proveedorId?: number): Promise<boolean> {
    try {
      const proveedores = await this.getProveedores();
      return !proveedores.some(proveedor => 
        proveedor.rfc === rfc && proveedor.id !== proveedorId
      );
    } catch (error) {
      console.error('Error al validar RFC:', error);
      return false;
    }
  }
}