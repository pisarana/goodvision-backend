import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './core/infrastructure/http/auth.guard';
import { MainShellComponent } from './presentation/layout/main-shell.component';
import { LoginPageComponent } from './presentation/pages/auth/login-page.component';
import { DashboardPageComponent } from './presentation/pages/dashboard/dashboard-page.component';
import { ProductosPageComponent } from './presentation/pages/productos/productos-page.component';
import { ClientesPageComponent } from './presentation/pages/clientes/clientes-page.component';
import { InventarioPageComponent } from './presentation/pages/inventario/inventario-page.component';
import { VentasPageComponent } from './presentation/pages/ventas/ventas-page.component';
import { MedidasPageComponent } from './presentation/pages/medidas/medidas-page.component';
import { CategoriasPageComponent } from './presentation/pages/categorias/categorias-page.component';
import { ReportesPageComponent } from './presentation/pages/reportes/reportes-page.component';
import { UsuariosPageComponent } from './presentation/pages/usuarios/usuarios-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: MainShellComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: DashboardPageComponent },
      { path: 'productos', component: ProductosPageComponent },
      { path: 'categorias', component: CategoriasPageComponent },
      { path: 'clientes', component: ClientesPageComponent },
      { path: 'ventas', component: VentasPageComponent },
      { path: 'medidas', component: MedidasPageComponent },
      { path: 'inventario', component: InventarioPageComponent },
      { path: 'reportes', component: ReportesPageComponent },
      { path: 'usuarios', component: UsuariosPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

