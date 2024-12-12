import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface LoginBody {
  username: string;
  password: string;
}

export interface SignupBody extends LoginBody {
  email: string;
}

export interface UserResponse {
  username: string;
  email: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'https://cookuisines.onrender.com/';

  constructor(private http: HttpClient) {}

  login(body: LoginBody): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.url + 'api-token-obtain/', body);
  }

  signup(body: SignupBody): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.url + 'api-user-register/', body);
  }

  refresh(body: LoginBody): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.url + 'api-token-refresh/', body);
  }
}
