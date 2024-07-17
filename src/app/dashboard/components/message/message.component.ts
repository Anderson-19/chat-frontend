import { Component, inject, Input } from '@angular/core';
import { Message } from '../../../interfaces';
import { DatePipe } from '@angular/common';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'Message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.component.html',
})
export class MessageComponent {

  private conversationService = inject(ConversationService);

  @Input() message: Message = {
    _id: '',
    senderId: '',
    receiverId: '',
    createdAt: ''
  }

  public show = false;

  showDrowDown(): boolean{
    return this.show = !this.show;
  }

  deleteMessage(){
    this.conversationService.deleteMessage(this.message._id).subscribe({
      next: (data) => {
        if(!data) return;

        this.conversationService.messages.update( lastMessages => lastMessages?.filter( message => message._id !== this.message._id ) );
        this.showDrowDown();
      }
    })
  }
}
