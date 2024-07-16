import { Component, inject, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { UserService } from '../../services/user.service';
import { User } from '../../../interfaces';

@Component({
  selector: 'header-left',
  standalone: true,
  imports: [],
  templateUrl: './header-left.component.html',
})
export class HeaderLeftComponent {
  
  private authService = inject(AuthService);
  private userService = inject(UserService);

  public show = false;

  getCurrentUser(): User {
    return this.authService.currentUser()!;
  }

  getAvatarUser(): string {
    if( !this.authService.currentUser()?.avatar ) return "https://res.cloudinary.com/dav7kqayl/image/upload/v1703882215/social-network/default-users/wsbtqrhs3537j8v2ptlg.png";
    return this.authService.currentUser()?.avatar!;
  }

  showDrowDown(): boolean{
    return this.show = !this.show;
  }

  openProfileUser(): boolean{
    this.userService.showProfileUser.set(true);
    return this.userService.showProfileUser();
  }

  logOut(){
    this.authService.logout();
  }
}
