import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    FormsModule ],
    
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    const success = await this.auth.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
