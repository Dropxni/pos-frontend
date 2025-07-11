import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NvoUsrComponent } from './pages/usuarios/nvo.usr/nvo.usr.component';
import { ActUsrComponent } from './pages/usuarios/act.usr/act.usr.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['gerente', 'administrador'] }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'usuarios/nuevo',
    component: NvoUsrComponent,
    canActivate: [authGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'usuarios/editar/:id',
    component: ActUsrComponent,
    canActivate: [authGuard],
    data: { roles: ['administrador'] }
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
