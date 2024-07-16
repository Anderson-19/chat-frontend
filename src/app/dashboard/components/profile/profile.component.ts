import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { ResponseGeneric, User } from '../../../interfaces';
import { UserService } from '../../services/user.service';
import { DefaultValueAccessor, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../auth/services/form-service';
import { environments } from '../../../../environments/environment';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  private authService = inject(AuthService);
  private formService = inject(FormService);
  private readonly baseUrl = environments.baseUrl;

  public selectedAvatar: any = null;
  public previewAvatar: any = null;
  public userService = inject(UserService);

  public formProfile: FormGroup = new FormGroup({
    name: new FormControl(this.getCurrentUser().name, [
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(this.formService.namePattern),
    ]),
    lastname: new FormControl(this.getCurrentUser().lastname, [
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(this.formService.lastnamePattern),
    ]),
    about: new FormControl(this.getCurrentUser().about, [
      Validators.minLength(3),
      Validators.maxLength(300),
    ])
  });


  handleSubmit(): void {
    if (this.formProfile.invalid) {
      this.formProfile.markAllAsTouched();
      return;
    }

    const { name, lastname, about } = this.formProfile.value;
    const token = localStorage.getItem("token")!;

    if(this.formProfile.value && !this.selectedAvatar){
      this.updateUser(name, lastname, about, token);
    } else {
      const formData = new FormData();
      formData.append("avatar", this.selectedAvatar);

      this.updateUser(name, lastname, about, token);
      this.userService.updateAvatar(formData, this.getCurrentUser(), token).subscribe({
        next: (res: ResponseGeneric) => {
          if(res.status !== 200) return;

          this.authService.updateUser({ avatar: res.message });
          this.closeModalEditUser();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  updateUser(name: string, lastname: string, about: string, token: string){
    this.userService.updateUser(name, lastname, about, this.getCurrentUser(), token).subscribe({
      next: (res: ResponseGeneric) => {
        if(res.status !== 200) return;

        this.authService.updateUser({name, lastname, about});
        this.closeModalEditUser();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  public selectFiles(event: any) {
    this.selectedAvatar = event.target?.files[0]; 
    this.previewAvatar =  URL.createObjectURL(this.selectedAvatar);
  }


  getCurrentUser(): User{
    return this.authService.currentUser()!;
  }

  getAvatarUser(): string {
    if( !this.authService.currentUser()?.avatar ) return "https://res.cloudinary.com/dav7kqayl/image/upload/v1703882215/social-network/default-users/wsbtqrhs3537j8v2ptlg.png";
    return this.authService.currentUser()?.avatar!;
  }

  closeProfileUser(): boolean{
    this.userService.showProfileUser.set(false);
    return this.userService.showProfileUser();
  }

  openModalEditUser(): boolean{
    this.userService.showEditUser.set(true);
    return this.userService.showEditUser();
  }

  closeModalEditUser(): boolean{
    this.userService.showEditUser.set(false);
    return this.userService.showEditUser();
  }

}
