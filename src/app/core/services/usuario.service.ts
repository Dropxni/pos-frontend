import { Injectable } from '@angular/core';
import axiosInstance from './axios-instance';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private authService: AuthService) {}

  async getUsuarios(): Promise<any[]> {
    const res = await axiosInstance.get('/usuarios');
    return res.data.usuarios;
  }

  async getUsuarioById(id: number): Promise<any> {
    const res = await axiosInstance.get(`/usuarios/${id}`);
    return res.data.usuario;
  }

  async crearUsuario(data: any): Promise<any> {
    const res = await axiosInstance.post('/usuarios', data);
    return res.data.usuario;
  }

  async actualizarUsuario(id: number, data: any): Promise<any> {
    const res = await axiosInstance.put(`/usuarios/${id}`, data);
    return res.data.usuario;
  }

  async cambiarEstadoUsuario(id: number, activo: boolean): Promise<any> {
    const res = await axiosInstance.patch(`/usuarios/${id}/activar`, { activo });
    return res.data.usuario;
  }

  async eliminarUsuario(id: number): Promise<any> {
    const res = await axiosInstance.delete(`/usuarios/${id}`);
    return res.data.usuario;
  }
}