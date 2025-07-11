import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import axiosInstance from '../../../core/services/axios-instance';

@Component({
  selector: 'app-nvo-usr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nvo.usr.component.html',
  styleUrls: ['./nvo.usr.component.css']
})
export class NvoUsrComponent implements OnInit {
  usuario = {
    nombre_usuario: '',
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    sucursal_id: null,
    rol_id: null,
    telefono: '',
    codigo_empleado: ''
  };

  roles: any[] = [];
  sucursales: any[] = [];
  cargando = false;
  creando = false;
  error = '';
  exito = '';

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    try {
      const [rolesRes, sucursalesRes] = await Promise.all([
        axiosInstance.get('/roles'),
        axiosInstance.get('/sucursales'),
      ]);

      this.roles = rolesRes.data.roles ?? rolesRes.data;
      this.sucursales = sucursalesRes.data.sucursales ?? sucursalesRes.data;
    } catch (error) {
      this.error = 'Error al cargar roles o sucursales';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  async crearUsuario(): Promise<void> {
    this.error = '';
    this.exito = '';
    this.creando = true;

    try {
      const payload = {
        ...this.usuario,
        rol_id: Number(this.usuario.rol_id),
        sucursal_id: Number(this.usuario.sucursal_id),
        telefono: this.usuario.telefono || undefined,
        codigo_empleado: this.usuario.codigo_empleado || undefined
      };

      await this.usuarioService.crearUsuario(payload);

      this.exito = '✅ Usuario creado correctamente';
      this.resetFormulario();
    } catch (error: any) {
      this.error = error?.response?.data?.error || '❌ Error al crear usuario';
      console.error(error);
    } finally {
      this.creando = false;
    }
  }

  resetFormulario() {
    this.usuario = {
      nombre_usuario: '',
      email: '',
      password: '',
      nombre: '',
      apellidos: '',
      sucursal_id: null,
      rol_id: null,
      telefono: '',
      codigo_empleado: ''
    };
  }
}
