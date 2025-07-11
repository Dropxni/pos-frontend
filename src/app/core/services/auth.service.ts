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
}
