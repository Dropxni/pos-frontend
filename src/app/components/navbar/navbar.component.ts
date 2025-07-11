import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass
],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isGerenteOrAdmin(): boolean {
    const role = this.auth.getUserRole();
    return role === 'gerente' || role === 'administrador';
  }

  isGerente(): boolean {
    return this.auth.getUserRole() === 'gerente';
  }

  isAdmin(): boolean {
    return this.auth.getUserRole() === 'administrador';
  }
}