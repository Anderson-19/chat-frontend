import { Component, inject, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'header-right',
  standalone: true,
  imports: [],
  templateUrl: './header-right.component.html',
})
export class HeaderRightComponent {
  @Input() name = '';
  @Input() lastname = '';
  @Input() avatar = '';
  @Input() isActive = false;

  public userService = inject(UserService);

  openInformationContact(): boolean{
    this.userService.showInformationContact.set(true);
    return this.userService.showInformationContact();
  }
}
