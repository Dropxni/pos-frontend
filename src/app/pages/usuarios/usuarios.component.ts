import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axiosInstance from '../../core/services/axios-instance';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  roles: any[] = [];
  sucursales: any[] = [];
  loading = true;

  filtros = {
    nombre: '',
    rol: '',
    sucursal: '',
    estado: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit() {
    try {
      this.loading = true;

      const [usuarios, rolesRes, sucursalesRes] = await Promise.all([
        this.usuarioService.getUsuarios(),
        axiosInstance.get('/roles'),
        axiosInstance.get('/sucursales'),
      ]);

      this.usuarios = usuarios;
      this.roles = rolesRes.data.roles ?? rolesRes.data;
      this.sucursales = sucursalesRes.data.sucursales ?? sucursalesRes.data;

      this.filtrarUsuarios();
    } catch (error) {
      alert('Error al cargar usuarios, roles o sucursales');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await this.usuarioService.eliminarUsuario(id);
      this.usuarios = await this.usuarioService.getUsuarios();
      this.filtrarUsuarios();
    }
  }

  async cambiarEstado(usuario: any) {
    await this.usuarioService.cambiarEstadoUsuario(usuario.id, !usuario.activo);
    this.usuarios = await this.usuarioService.getUsuarios();
    this.filtrarUsuarios();
  }

  filtrarUsuarios() {
    const { nombre, rol, sucursal, estado } = this.filtros;

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const matchNombre = usuario.nombre.toLowerCase().includes(nombre.toLowerCase());
      const matchRol = rol ? usuario.roles?.nombre === rol : true;
      const matchSucursal = sucursal ? usuario.sucursales?.nombre === sucursal : true;
      const matchEstado =
        estado === 'activo' ? usuario.activo :
        estado === 'inactivo' ? !usuario.activo :
        true;

      return matchNombre && matchRol && matchSucursal && matchEstado;
    });
  }

  editarUsuario(usuario: any) {
    alert(`Editar usuario con ID ${usuario.id} - Implementa navegación o modal`);
  }
}
