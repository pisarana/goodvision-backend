import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/infrastructure/http/auth.interceptor';
import { errorInterceptor } from './core/infrastructure/http/error.interceptor';
import { AuthRepository } from './core/domain/repositories/auth.repository';
import { ClienteRepository } from './core/domain/repositories/cliente.repository';
import { ProductoRepository } from './core/domain/repositories/producto.repository';
import { InventarioRepository } from './core/domain/repositories/inventario.repository';
import { VentaRepository } from './core/domain/repositories/venta.repository';
import { MedidaRepository } from './core/domain/repositories/medida.repository';
import { CategoriaRepository } from './core/domain/repositories/categoria.repository';
import { UsuarioRepository } from './core/domain/repositories/usuario.repository';
import { AuthApiRepository } from './core/infrastructure/http/auth-api.repository';
import { ClienteApiRepository } from './core/infrastructure/http/cliente-api.repository';
import { ProductoApiRepository } from './core/infrastructure/http/producto-api.repository';
import { InventarioApiRepository } from './core/infrastructure/http/inventario-api.repository';
import { VentaApiRepository } from './core/infrastructure/http/venta-api.repository';
import { MedidaApiRepository } from './core/infrastructure/http/medida-api.repository';
import { CategoriaApiRepository } from './core/infrastructure/http/categoria-api.repository';
import { UsuarioApiRepository } from './core/infrastructure/http/usuario-api.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: AuthRepository, useClass: AuthApiRepository },
    { provide: ClienteRepository, useClass: ClienteApiRepository },
    { provide: ProductoRepository, useClass: ProductoApiRepository },
    { provide: InventarioRepository, useClass: InventarioApiRepository },
    { provide: VentaRepository, useClass: VentaApiRepository },
    { provide: MedidaRepository, useClass: MedidaApiRepository },
    { provide: CategoriaRepository, useClass: CategoriaApiRepository },
    { provide: UsuarioRepository, useClass: UsuarioApiRepository }
  ]
};

