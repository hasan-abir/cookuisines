import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClient,
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

describe('globalAPIInterceptor', () => {
  let httpClient: HttpClient;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let httpTesting: HttpTestingController;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => globalAPIInterceptor(req, next));

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'setWaitingState',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceSpy },
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
});
