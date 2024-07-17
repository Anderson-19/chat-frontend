import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth-service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../interfaces';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ConversationService extends Socket {
  private readonly baseUrl = environments.baseUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private _contactInConversation = signal<User | undefined>(undefined);

  public contactInConversation = computed(() => this._contactInConversation());

  constructor() {
    super({
      url: environments.baseUrl,
      options: {
        extraHeaders: {
          Authorization: localStorage?.getItem('token')!,
        },
      },
    });
  }

  findAllMessages(receiver: string): Observable<any> {
    const token = localStorage?.getItem('token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
    return this.http
      .get<any>(
        `${this.baseUrl}/conversation/${this.authService.currentUser()?._id}/${receiver}`, { headers }
      )
      .pipe(
        map((data) => data),
        catchError((err) => throwError(() => err.error))
      );
  }
  
  selectedUser(contact: User) {
    this._contactInConversation.set(contact);
  }
}
