import { Injectable } from '@angular/core';
import { UserJson } from '../interfaces/user.json-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token = null;

  constructor(
    private readonly http: HttpClient,
  ) {}

  public login(user: UserJson): Observable<{token: string}> {
    return this.http
      .post<{token: string}>('/api/auth/login', user)
      .pipe(map(answer => {
        localStorage.setItem('auth-token', answer.token);
        this.setToken(answer.token);
        return answer;
      }));
  }

  public register(user: UserJson): Observable<UserJson> {
    return this.http
      .post<UserJson>('/api/auth/register', user)
      .pipe(map(answer => {
        return answer;
      }));
  }

  public getToken(): string {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public logout(): void {
    this.setToken(null);
    localStorage.clear();
  }

  public setToken(token: string): void {
    this.token = token;
  }
}
