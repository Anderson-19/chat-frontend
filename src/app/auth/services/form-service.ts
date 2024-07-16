import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  public namePattern: string = '([a-zA-Z]+)';
  public lastnamePattern: string = '([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor() { }

  isValidField(field: string, form: FormGroup): boolean | null {
    return (
      form.controls[field].errors &&
      form.controls[field].touched
    );
  }

  getFieldError(field: string, form: FormGroup): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'pattern':
          return 'Email invalido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
        case 'maxlength':
          return `Maxímo ${errors['maxlength'].requiredLength} caracters.`;
      }
    }

    return null;
  }
}
