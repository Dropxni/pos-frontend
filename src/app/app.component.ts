import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cremeria-oaxaca';
  showSidebar = false;
  currentRoute = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateSidebarVisibility();
      });

    // Verificar estado inicial
    this.updateSidebarVisibility();
  }

  private updateSidebarVisibility() {
    // Ocultar sidebar solo en login
    this.showSidebar = !this.currentRoute.includes('/login');
  }

  getCurrentRoute(): string {
    if (this.currentRoute.includes('/dashboard')) return 'dashboard';
    if (this.currentRoute.includes('/ventas')) return 'ventas';
    if (this.currentRoute.includes('/inventario')) return 'inventario';
    if (this.currentRoute.includes('/productos')) return 'productos';
    if (this.currentRoute.includes('/categorias')) return 'categorias';
    if (this.currentRoute.includes('/proveedores')) return 'proveedores';
    if (this.currentRoute.includes('/reportes')) return 'reportes';
    if (this.currentRoute.includes('/usuarios')) return 'usuarios';
    return '';
  }

  getCurrentUser(): string {
    return this.authService.getCurrentUser() || 'Usuario';
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    const names = user.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.substring(0, 2).toUpperCase();
  }
}