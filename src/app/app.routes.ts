import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NvoUsrComponent } from './pages/usuarios/nvo.usr/nvo.usr.component';
import { ActUsrComponent } from './pages/usuarios/act.usr/act.usr.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ActCatComponent } from './pages/categoria/act.cat/act.cat.component';
import { NvoCatComponent } from './pages/categoria/nvo.cat/nvo.cat.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

// Constantes para roles
const ROLES = {
  ADMINISTRADOR: 'administrador',
  GERENTE: 'gerente'
} as const;

// Constantes para rutas
const ROUTES_PATHS = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  USUARIOS: 'usuarios',
  CATEGORIAS: 'categorias',
  PROVEEDORES: 'proveedores',
} as const;

export const routes: Routes = [
  // Ruta pública
  { 
    path: ROUTES_PATHS.LOGIN, 
    component: LoginComponent 
  },
  
  // Rutas protegidas - Dashboard
  {
    path: ROUTES_PATHS.DASHBOARD,
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: [ROLES.GERENTE, ROLES.ADMINISTRADOR] }
  },
  
  // Rutas protegidas - Usuarios (lazy loading y rutas anidadas)
  {
    path: ROUTES_PATHS.USUARIOS,
    canActivate: [authGuard],
    data: { roles: [ROLES.ADMINISTRADOR] },
    children: [
      {
        path: '',
        component: UsuariosComponent
      },
      {
        path: 'nuevo',
        component: NvoUsrComponent
      },
      {
        path: 'editar/:id',
        component: ActUsrComponent
      }
    ]
  },
  
  // Rutas protegidas - Categorías (lazy loading completo)
  {
    path: ROUTES_PATHS.CATEGORIAS,
    canActivate: [authGuard],
    data: { roles: [ROLES.ADMINISTRADOR] },
    children: [
      {
        path: '',
        component: CategoriaComponent
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/categoria/nvo.cat/nvo.cat.component')
          .then(m => m.NvoCatComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/categoria/act.cat/act.cat.component')
          .then(m => m.ActCatComponent)
      }
    ]
  },

  // Rutas protegidas - Proveedores (lazy loading parcial)
  {
    path: ROUTES_PATHS.PROVEEDORES,
    canActivate: [authGuard],
    data: { roles: [ROLES.ADMINISTRADOR] },
    children: [
      {
        path: '',
        component: ProveedorComponent
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/proveedor/nvo.prv/nvo.prv.component')
          .then(m => m.NvoPrvComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/proveedor/act.prv/act.prv.component')
          .then(m => m.ActPrvComponent)
      }
    ]
  },
  // Rutas de manejo de errores
  //{
   // path: '404',
   // loadComponent: () => import('./pages/not-found/not-found.component')
    //  .then(m => m.NotFoundComponent)
  // },
  // {
   //  path: 'unauthorized',
   // loadComponent: () => import('./pages/unauthorized/unauthorized.component')
   //   .then(m => m.UnauthorizedComponent)
  //},
  
  // Redirecciones
  { 
    path: '', 
    redirectTo: `/${ROUTES_PATHS.LOGIN}`, 
    pathMatch: 'full' 
  },
  
  // Ruta wildcard - debe ir al final
  { 
    path: '**', 
    redirectTo: '/404' 
  }
];

// Opcional: Exportar tipos para mayor seguridad de tipos
export type UserRole = typeof ROLES[keyof typeof ROLES];
export type RoutePath = typeof ROUTES_PATHS[keyof typeof ROUTES_PATHS];