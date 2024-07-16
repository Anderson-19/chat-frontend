import { Routes } from '@angular/router';
import { LoginComponent, RegisterComponent } from './pages';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
              path: '',
              title: 'Login',
              component: LoginComponent,
            },
            {
              path: 'register',
              title: 'Register',
              component: RegisterComponent,
            }
        ]
    }
];
