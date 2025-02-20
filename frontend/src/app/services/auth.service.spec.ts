import { TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService, LoginBody, SignupBody } from './auth.service';
import { globalAPIInterceptor } from '../interceptors/global_api.interceptor';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([globalAPIInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login: should call API', () => {
    const body: LoginBody = {
      username: 'test_user',
      password: 'testtest',
    };
    service.login(body).subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-token-obtain/'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('verify: should call API', () => {
    service.verify().subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-user-verify/'
    );
    expect(req.request.method).toBe('POST');
  });

  it('logout: should call API', () => {
    service.logout().subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-token-delete/'
    );
    expect(req.request.method).toBe('DELETE');
  });

  it('signup: should call API', () => {
    const body: SignupBody = {
      username: 'test_user',
      email: 'test@test.com',
      password: 'testtest',
    };
    service.signup(body).subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-user-register/'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('refresh: should call API', () => {
    service.refresh().subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-token-refresh/'
    );
    expect(req.request.method).toBe('POST');
  });

  it('verifyAndSetVerifiedUser: should do what it is supposed to', async () => {
    const user = {
      email: 'test@test.com',
      username: 'test',
    };

    spyOn(service, 'setUserState');
    spyOn(service, 'setVerifiedState');
    spyOn(service, 'setVerifyingState');
    spyOn(service, 'verify').and.returnValue(of(user));
    await service.verifyAndSetVerifiedUser();

    expect(service.setUserState).toHaveBeenCalledWith(user);
    expect(service.setVerifiedState).toHaveBeenCalledWith(true);
    expect(service.setVerifyingState).toHaveBeenCalledWith(true);
    expect(service.setVerifyingState).toHaveBeenCalledWith(false);
  });

  it('verifyAndSetVerifiedUser: should not do what it is supposed to when error', async () => {
    spyOn(service, 'setUserState');
    spyOn(service, 'verify').and.returnValue(throwError(() => new Error()));
    await service.verifyAndSetVerifiedUser();

    expect(service.setUserState).toHaveBeenCalledWith(null);
  });
});
