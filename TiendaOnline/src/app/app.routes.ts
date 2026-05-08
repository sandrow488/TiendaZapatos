import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
  },
  {
    path: 'catalogo/:id',
    loadComponent: () =>
      import('./pages/detalle-producto/detalle-producto').then(
        (m) => m.DetalleProducto,
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito').then((m) => m.Carrito),
  },
  {
    path: 'mis-pedidos',
    loadComponent: () =>
      import('./pages/mis-pedidos/mis-pedidos').then((m) => m.MisPedidos),
  },
  {
    path: 'admin/productos',
    loadComponent: () =>
      import('./pages/admin-productos/admin-productos').then(
        (m) => m.AdminProductos,
      ),
  },
  {
    path: 'admin/pedidos',
    loadComponent: () =>
      import('./pages/admin-pedidos/admin-pedidos').then(
        (m) => m.AdminPedidos,
      ),
  },
  { path: '**', redirectTo: '' },
];
