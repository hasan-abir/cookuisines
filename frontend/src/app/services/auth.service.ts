import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

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
  private verifyingSubject = new BehaviorSubject<boolean>(false);
  verifying$ = this.verifyingSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(body: LoginBody): Observable<null> {
    return this.http.post<null>(this.url + 'api-token-obtain/', body, {
      withCredentials: true,
    });
  }

  verify(): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      this.url + 'api-user-verify/',
      {},
      { withCredentials: true }
    );
  }

  signup(body: SignupBody): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.url + 'api-user-register/', body);
  }

  refresh(): Observable<null> {
    return this.http.post<null>(this.url + 'api-token-refresh/', {});
  }

  setVerifyingState(state: boolean) {
    this.verifyingSubject.next(state);
  }
}
