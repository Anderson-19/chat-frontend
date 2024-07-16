import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormService } from '../../services/form-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public formService = inject(FormService);

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(this.formService.emailPattern),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
    ]),
  });

  handleSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        if(!data) return;
        
        this.loginForm.reset();
        this.router.navigateByUrl('dashboard');
      },
      error: (error) => {
        if(error.email && error.password){
          Swal.fire('El email y password son inválidos', '', 'error' );
        } else if(error.email){
          Swal.fire('El email es inválido', '', 'error' );
        } else {
          Swal.fire('El password es inválido', '', 'error' );
        }
      },
    });
  }
}
