import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStatus, ResponseGeneric, User } from '../../interfaces';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { CheckTokenResponse } from '../../interfaces/check-token.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | undefined>(undefined);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  register(user: User): Observable<ResponseGeneric> {
    return this.http.post<ResponseGeneric>(
      `${this.baseUrl}/api/auth/register`,
      user
    );
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set({ ...user, avatar: user.avatar ? user.avatar : "" });
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<ResponseGeneric>(`${this.baseUrl}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        map(({ data }) => this.setAuthentication(data?.user!, data?.token!)),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  private checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/api/auth/checkToken`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    this.http.get<boolean>(`${this.baseUrl}/api/auth/logout/${ this.currentUser()?.email }`)
    .subscribe((data: boolean) => {
      if(!data) return false;

      localStorage.removeItem('token');
      localStorage.removeItem('contactInConversation');
      this._currentUser.set(undefined);
      this._authStatus.set(AuthStatus.notAuthenticated);
      return true;
    })
  }

  updateUser(user: any){
    this._currentUser.update( lastDataUser => ({ ...lastDataUser!, ...user }) );
  }

}
