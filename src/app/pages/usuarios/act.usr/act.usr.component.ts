import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axiosInstance from '../../../core/services/axios-instance';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-act-usr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './act.usr.component.html'
})
export class ActUsrComponent implements OnInit {
  usuarioId: number = 0;
  usuario: any = {
    nombre_usuario: '',
    email: '',
    nombre: '',
    apellidos: '',
    sucursal_id: null,
    rol_id: null,
    telefono: '',
    codigo_empleado: ''
  };

  roles: any[] = [];
  sucursales: any[] = [];

  cargando = true;
  guardando = false;
  error = '';
  exito = '';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit(): Promise<void> {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargando = true;

    try {
      const [usuarioRes, rolesRes, sucursalesRes] = await Promise.all([
        this.usuarioService.getUsuarioById(this.usuarioId),
        axiosInstance.get('/roles'),
        axiosInstance.get('/sucursales')
      ]);

      const data = usuarioRes.usuario ?? usuarioRes;
      this.usuario = {
        ...this.usuario,
        ...data
      };

      this.roles = rolesRes.data.roles ?? rolesRes.data;
      this.sucursales = sucursalesRes.data.sucursales ?? sucursalesRes.data;
    } catch (err) {
      console.error(err);
      this.error = 'Error al cargar datos del usuario.';
    } finally {
      this.cargando = false;
    }
  }

  async guardarCambios(): Promise<void> {
    this.error = '';
    this.exito = '';
    this.guardando = true;

    try {
      const payload = {
        nombre_usuario: this.usuario.nombre_usuario,
        email: this.usuario.email,
        nombre: this.usuario.nombre,
        apellidos: this.usuario.apellidos,
        rol_id: Number(this.usuario.rol_id),
        sucursal_id: Number(this.usuario.sucursal_id),
        telefono: this.usuario.telefono || null,
        codigo_empleado: this.usuario.codigo_empleado || null
      };

      await this.usuarioService.actualizarUsuario(this.usuarioId, payload);
      this.exito = '✅ Usuario actualizado correctamente';
    } catch (err: any) {
      console.error(err);
      this.error = err?.response?.data?.error || '❌ Error al actualizar usuario';
    } finally {
      this.guardando = false;
    }
  }
}
