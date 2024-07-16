import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    canActivate: [privateGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.routes),
  },
];
