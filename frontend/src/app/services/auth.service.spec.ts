import { TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService, LoginBody, SignupBody } from './auth.service';
import { globalAPIInterceptor } from '../interceptors/global_api.interceptor';

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
});
