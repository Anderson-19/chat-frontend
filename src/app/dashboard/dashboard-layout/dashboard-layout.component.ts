import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message, User } from '../../interfaces';
import { AuthService } from '../../auth/services/auth-service';
import {
  ContactComponent,
  HeaderLeftComponent,
  HeaderRightComponent,
  ProfileComponent,
  OtherProfileComponent,
} from '../components';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ContactComponent,
    HeaderLeftComponent,
    HeaderRightComponent,
    ProfileComponent,
    OtherProfileComponent,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private conversationService = inject(ConversationService);
  public userService = inject(UserService);

  public contacts: User[] = [];
  public messages: Message[] = [];
  public isActive = false;
  public senderId = this.authService.currentUser()?._id;
  public dateStartConversation = "";

  public inputMessageForm: FormGroup = new FormGroup({
    input: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor() {
    this.conversationService.on('newMessage', (newMessage: Message) => {
      this.messages = [...this.messages, newMessage];
    });

    this.conversationService.on('userConnected', (value: User) => {
      this.isActive = value.isActive;
    });
  }

  ngOnInit(): void {
    this.userService.findAllUsers().subscribe({
      next: (data) => {
        this.contacts = data.filter(
          (user) => user._id != this.authService.currentUser()?._id
        );
      },
      error: (error) => error,
    });
  }

  public handleSubmitMessage() {
    if (this.inputMessageForm.invalid) {
      this.inputMessageForm.markAllAsTouched();
      return;
    }

    const { input } = this.inputMessageForm.value;

    const data = {
      senderId: this.authService.currentUser()?._id,
      receiverId: this.conversationService.contactInConversation()?._id,
      message: input,
    };

    this.conversationService.emit('createMessage', data);
    this.inputMessageForm.reset();
  }

  getAvatarUser(data: User): string {
    if (!data.avatar)
      return 'https://res.cloudinary.com/dav7kqayl/image/upload/v1703882215/social-network/default-users/wsbtqrhs3537j8v2ptlg.png';
    return data.avatar;
  }

  selectedUser(contact: User) {
    this.conversationService.selectedUser({
      ...contact,
      avatar: this.getAvatarUser(contact),
    });
    localStorage.setItem('contactInConversation', contact.email);
    this.conversationService.emit('userConnected', { email: contact.email });
    this.findAllMessages();
  }

  findAllMessages() {
    this.conversationService.findAllMessages(this.conversationService.contactInConversation()?._id!).subscribe({
      next: (data) => {
        this.messages = data;
        this.dateStartConversation = this.messages[0] ? this.messages[0]?.createdAt : "";
      },
      error: (err) => err,
    });
  }

  selectedContact(): User {
    return this.conversationService.contactInConversation()!;
  }

  public contactInConversationChangedEffect = effect(() => {
    this.authService.currentUser();
    this.conversationService.contactInConversation();
    this.userService.showProfileUser();
  });
}
