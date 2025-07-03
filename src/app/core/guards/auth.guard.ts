import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles: string[] = route.data['roles'] ?? [];

  if (allowedRoles.length === 0) {
    return true;
  }

  const userRole = auth.getUserRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
