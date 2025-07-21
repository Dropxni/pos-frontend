import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../../../core/services/proveedor.service';

@Component({
  selector: 'app-act-prv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './act.prv.component.html',
  styleUrls: ['./act.prv.component.css']
})
export class ActPrvComponent implements OnInit {
  proveedorForm: FormGroup;
  proveedorId!: number;
  mensaje: string = '';
  error: string = '';
  cargando = true;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    this.proveedorForm = this.fb.group({
      codigo: ['', Validators.required],
      razon_social: ['', Validators.required],
      nombre_contacto: ['', Validators.required],
      telefono: [''],
      email: ['', Validators.email],
      direccion: [''],
      rfc: [''],
      dias_credito: [0, [Validators.required, Validators.min(0)]],
      limite_credito: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'ID de proveedor no especificado';
      this.cargando = false;
      return;
    }

    this.proveedorId = parseInt(idParam, 10);

    try {
      const proveedor = await this.proveedorService.getProveedorById(this.proveedorId);
      this.proveedorForm.patchValue(proveedor);
    } catch (err: any) {
      this.error = 'Error al cargar el proveedor';
    } finally {
      this.cargando = false;
    }
  }

  async actualizarProveedor() {
    this.enviando = true;
    this.mensaje = '';
    this.error = '';

    if (this.proveedorForm.invalid) {
      this.error = 'Revisa los campos requeridos.';
      this.enviando = false;
      return;
    }

    try {
      await this.proveedorService.actualizarProveedor(this.proveedorId, this.proveedorForm.value);
      this.mensaje = 'Proveedor actualizado correctamente.';
      this.router.navigate(['/proveedores']);
    } catch (err: any) {
      this.error = 'Error al actualizar proveedor.';
    } finally {
      this.enviando = false;
    }
  }
}
