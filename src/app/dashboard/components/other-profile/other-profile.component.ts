import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ConversationService } from '../../services/conversation.service';
import { User } from '../../../interfaces';

@Component({
  selector: 'other-profile',
  standalone: true,
  imports: [],
  templateUrl: './other-profile.component.html'
})
export class OtherProfileComponent {

  private userService = inject(UserService);
  private conversationService = inject(ConversationService);

  closeInformationContact(): boolean{
    this.userService.showInformationContact.set(false);
    return this.userService.showInformationContact();
  }

  getInformationContact(): User{
    return this.conversationService.contactInConversation()!;
  }

}
