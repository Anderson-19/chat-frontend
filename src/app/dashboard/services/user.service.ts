import { computed, inject, Injectable, OnInit, Signal, signal } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environments.baseUrl;
  private http = inject(HttpClient);

  public showProfileUser = signal(false);
  public showEditUser = signal(false);
  public showInformationContact = signal(false);
  
  findAllUsers(): Observable<User[]> {
    const token = localStorage?.getItem('token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
    return this.http.get<User[]>(`${this.baseUrl}/user/findAllUsers`, { headers }).pipe(
      map((res) => res),
      catchError((err) => throwError(() => err.error))
    );
  }

  findOne(contactInConversationId: string): Observable<User>{
    const token = localStorage?.getItem('token')!;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
    return this.http.get<User>(`${this.baseUrl}/user/${ contactInConversationId }`, { headers }).pipe(
      map((data) => data),
      catchError((err) => throwError(() => err.error))
    );
  }

  updateUser(name: string, lastname: string, about: string, user: User, token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);
    return this.http.put(`${this.baseUrl}/user/updateUser/${ user._id }`, {name, lastname, about}, { headers }).pipe(
      map((res) => res ),
      catchError((err) => throwError(() => err.error))
    )
  }

  updateAvatar(avatar: any, user: User, token: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`).set("server", this.baseUrl);
    return this.http.put(`${this.baseUrl}/user/updateAvatar/${ user._id }`, avatar, { headers }).pipe(
      map((res) => res ),
      catchError((err) => throwError(() => err.error))
    )
  } 
  
}
