import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nvo-prv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nvo.prv.component.html',
  styleUrls: ['./nvo.prv.component.css']
})
export class NvoPrvComponent {
  proveedorForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    this.proveedorForm = this.fb.group({
      codigo: ['', Validators.required],
      razon_social: ['', Validators.required],
      nombre_contacto: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.email]],
      direccion: [''],
      rfc: [''],
      dias_credito: [0, [Validators.required, Validators.min(0)]],
      limite_credito: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  async guardarProveedor() {
    this.enviando = true;
    this.mensaje = '';
    this.error = '';

    if (this.proveedorForm.invalid) {
      this.error = 'Por favor completa los campos requeridos.';
      this.enviando = false;
      return;
    }

    try {
      await this.proveedorService.crearProveedor(this.proveedorForm.value);
      this.mensaje = 'Proveedor creado correctamente.';
      this.proveedorForm.reset({ activo: true });
      this.router.navigate(['/proveedores']); // Ajusta la ruta según tu app
    } catch (err: any) {
      this.error = 'Error al crear proveedor.';
    } finally {
      this.enviando = false;
    }
  }
}
