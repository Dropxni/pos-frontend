import { Component, OnInit, HostListener, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isHidden = false;
  sidebarOpen = false;
  productosSubmenuOpen = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // En desktop, mantener el sidebar abierto por defecto
    this.checkScreenSize();
  }

  // Escuchar cambios en el tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Verificar si estamos en el navegador antes de acceder a window
    if (isPlatformBrowser(this.platformId) && !this.isHidden) {
      // Si la pantalla es grande (lg), mantener sidebar abierto
      if (window.innerWidth >= 1024) {
        this.sidebarOpen = true;
      } else {
        this.sidebarOpen = false;
      }
    }
  }

  toggleSidebar() {
    if (!this.isHidden) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  closeSidebar() {
    // Solo cerrar en pantallas pequeñas y si no está oculto
    if (!this.isHidden && isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
    // También cerrar submenus cuando se cierra el sidebar
    this.productosSubmenuOpen = false;
  }

  toggleProductosSubmenu() {
    this.productosSubmenuOpen = !this.productosSubmenuOpen;
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