import { Injectable } from '@angular/core';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
  private api = 'http://localhost:3000/api';
  token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await axios.post(`${this.api}/auth/login`, { email, password });
      this.token = res.data.token;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('token', this.token!);
      }
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
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
