import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

interface TokenPayload {
  id: number;
  rol: string;
  rol_id: number;
  sucursal_id: number;
  permisos: string[];
  iat: number;
  exp: number;
  // Agregar campos opcionales para nombre de usuario
  nombre?: string;
  email?: string;
  username?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private isBrowser: boolean;
  token: string | null = null;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.token = localStorage.getItem('token');
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.api}/auth/login`, { email, password });
      this.token = res.data.token;
      if (this.isBrowser) {
        localStorage.setItem('token', this.token!);
      }
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    this.token = null;
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUserRole(): string | null {
    if (!this.token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      return decoded.rol;
    } catch {
      return null;
    }
  }

  getUserRoleId(): number | null {
    if (!this.token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      return decoded.rol_id;
    } catch {
      return null;
    }
  }

  isRole(expectedRole: string): boolean {
    return this.getUserRole() === expectedRole;
  }

  getUserData(): TokenPayload | null {
    if (!this.token) return null;
    try {
      return jwtDecode<TokenPayload>(this.token);
    } catch {
      return null;
    }
  }

  getCurrentUser(): string {
    if (!this.token) return 'Usuario';
    
    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      
      // Intentar obtener el nombre del usuario desde el token
      if (decoded.nombre) {
        return decoded.nombre;
      }
      
      if (decoded.email) {
        // Si no hay nombre, usar la parte antes del @ del email
        return decoded.email.split('@')[0];
      }
      
      if (decoded.username) {
        return decoded.username;
      }
      
      // Si no hay información del usuario, mostrar el rol
      return decoded.rol || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  getUserId(): number | null {
    if (!this.token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      return decoded.id;
    } catch {
      return null;
    }
  }

  getUserEmail(): string | null {
    if (!this.token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      return decoded.email || null;
    } catch {
      return null;
    }
  }
}