import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
    const body = {
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

  it('signup: should call API', () => {
    const body = {
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
    const body = {
      username: 'test_user',
      password: 'testtest',
    };
    service.refresh(body).subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/api-token-refresh/'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });
});
