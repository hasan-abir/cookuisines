import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();
  private verifyingSubject = new BehaviorSubject<boolean>(false);
  verifying$ = this.verifyingSubject.asObservable();
  private verifiedSubject = new BehaviorSubject<boolean>(false);
  verified$ = this.verifiedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(body: LoginBody): Observable<null> {
    return this.http.post<null>('api-token-obtain/', body, {
      withCredentials: true,
    });
  }

  verify(): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      'api-user-verify/',
      {},
      { withCredentials: true }
    );
  }

  signup(body: SignupBody): Observable<UserResponse> {
    return this.http.post<UserResponse>('api-user-register/', body);
  }

  refresh(): Observable<null> {
    return this.http.post<null>(
      'api-token-refresh/',
      {},
      {
        withCredentials: true,
      }
    );
  }

  setVerifyingState(state: boolean) {
    this.verifyingSubject.next(state);
  }
  setVerifiedState(state: boolean) {
    this.verifiedSubject.next(state);
  }
  setAuthenticatedState(state: boolean) {
    this.authenticatedSubject.next(state);
  }
}
