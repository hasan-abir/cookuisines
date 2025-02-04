import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { globalAPIInterceptor } from './global_api.interceptor';
import { NotificationService } from '../services/notification.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { Observable, of, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';

describe('globalAPIInterceptor', () => {
  let httpClient: HttpClient;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpTesting: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => globalAPIInterceptor(req, next));

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'setWaitingState',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['refresh']);

    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: router },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call setWaitingState(true) after 10 seconds timeout', fakeAsync(() => {
    notificationServiceSpy.setWaitingState.calls.reset();

    httpClient.get('test').subscribe();

    tick(11000);

    expect(notificationServiceSpy.setWaitingState).toHaveBeenCalledWith(true);

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');
    req.flush({});
  }));

  it('should not call setWaitingState(true) before 10 seconds timeout', fakeAsync(() => {
    notificationServiceSpy.setWaitingState.calls.reset();

    httpClient.get('test').subscribe();

    tick(5000);

    expect(notificationServiceSpy.setWaitingState).not.toHaveBeenCalled();

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');
    req.flush({});
  }));

  it('should rerun the request when status is 401 and refresh is successful', fakeAsync(() => {
    authServiceSpy.refresh.and.returnValue(of(null));

    httpClient.get('test').subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
      },
    });

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');

    req.error(new ProgressEvent('Unauth'), {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.refresh).toHaveBeenCalled();

    httpTesting.expectOne('https://cookuisines.onrender.com/test');
  }));

  it('should navigate to not-found when status is 404', fakeAsync(() => {
    httpClient.get('test').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');

    req.error(new ProgressEvent('Unauth'), {
      status: 404,
      statusText: 'Not found',
    });

    httpTesting.expectNone('https://cookuisines.onrender.com/test');
    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  }));

  it('should rerun the request when status is 0 and refresh is successful', fakeAsync(() => {
    authServiceSpy.refresh.and.returnValue(of(null));

    httpClient.get('test').subscribe({
      error: (err) => {
        expect(err.status).toBe(0);
      },
    });

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');

    req.error(new ProgressEvent('Unauth'), {
      status: 0,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.refresh).toHaveBeenCalled();

    httpTesting.expectOne('https://cookuisines.onrender.com/test');
  }));

  it('should navigate to login when status is 401 and refresh is unsuccessful', fakeAsync(() => {
    authServiceSpy.refresh.and.returnValue(throwError(() => new Error()));

    httpClient.get('test').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');

    req.error(new ProgressEvent('Unauth'), {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.refresh).toHaveBeenCalled();

    httpTesting.expectNone('https://cookuisines.onrender.com/test');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should navigate to login when status is 0 and refresh is unsuccessful', fakeAsync(() => {
    authServiceSpy.refresh.and.returnValue(
      throwError(() => {
        const err: any = new Error();
        err.status = 0;
        return err;
      })
    );

    httpClient.get('test').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpTesting.expectOne('https://cookuisines.onrender.com/test');

    req.error(new ProgressEvent('Unauth'), {
      status: 0,
      statusText: 'Unauthorized',
    });

    expect(authServiceSpy.refresh).toHaveBeenCalled();

    httpTesting.expectNone('https://cookuisines.onrender.com/test');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
