import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormService } from '../../services/form-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  public authService = inject(AuthService);
  public formService = inject(FormService);
  public router = inject(Router);
  public error: any;

  public registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(this.formService.namePattern),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(this.formService.lastnamePattern),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.registerForm.reset();
        this.router.navigateByUrl('');
      },
      error: ({ error }) => {
        if(error.message?.email && error.message?.username){
          Swal.fire('El email y username ya existen', '', 'error' );
        } else if(error.message?.email){
          Swal.fire('El email ya existen', '', 'error' );
        } else {
          Swal.fire('El username ya existen', '', 'error' );
        }
      },
    });
  }

}
