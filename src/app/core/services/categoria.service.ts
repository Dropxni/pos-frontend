import { Injectable } from '@angular/core';
import axiosInstance from './axios-instance';
import { AuthService } from './auth.service';

export interface Categoria {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  requiere_refrigeracion: boolean;
  requiere_control_caducidad: boolean;
  categoria_padre_id?: number;
  activo: boolean;
  categoria_padre?: {
    id: number;
    nombre: string;
  };
  subcategorias?: {
    id: number;
    nombre: string;
    activo: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private authService: AuthService) {}

  async getCategorias(): Promise<Categoria[]> {
    try {
      const res = await axiosInstance.get('/categorias');
      return res.data.categorias as Categoria[];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  async getCategoriaById(id: number): Promise<Categoria> {
    try {
      const res = await axiosInstance.get(`/categorias/${id}`);
      return res.data as Categoria;
    } catch (error) {
      console.error(`Error al obtener categoría con id ${id}:`, error);
      throw error;
    }
  }

  async crearCategoria(data: Partial<Categoria>): Promise<Categoria> {
    try {
      const res = await axiosInstance.post('/categorias', data);
      return res.data as Categoria;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  async actualizarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
    try {
      const res = await axiosInstance.put(`/categorias/${id}`, data);
      return res.data as Categoria;
    } catch (error) {
      console.error(`Error al actualizar categoría con id ${id}:`, error);
      throw error;
    }
  }

  async eliminarCategoria(id: number): Promise<{ message: string }> {
    try {
      const res = await axiosInstance.delete(`/categorias/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error al eliminar categoría con id ${id}:`, error);
      throw error;
    }
  }

  async getCategoriasDesactivadas(): Promise<Categoria[]> {
  const res = await axiosInstance.get<{ categorias: Categoria[] }>('/categorias', {
    params: {
      incluir_inactivas: 'true',
      filtro_estado: 'inactivo'
    }
  });
  return res.data.categorias;
}
}
