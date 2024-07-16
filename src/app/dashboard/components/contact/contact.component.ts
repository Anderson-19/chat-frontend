import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'Contact',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  @Input() _id = '';
  @Input() name = '';
  @Input() lastname = '';
  @Input() updatedAt = '';
  @Input() avatar = '';

  public lastMessage = '';

  private conversationService = inject(ConversationService);

  ngOnInit(): void {
    this.conversationService.findAllMessages(this._id).subscribe({
      next: (data) => {
        this.lastMessage = data.at(-1)?.message ?? "No hay mensajes";
      }
    })
  }

  getAvatarUser(): string {
    if( !this.avatar ) return "https://res.cloudinary.com/dav7kqayl/image/upload/v1703882215/social-network/default-users/wsbtqrhs3537j8v2ptlg.png";
    return this.avatar;
  }
  
}
