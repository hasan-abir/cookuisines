import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const globalAPIInterceptor: HttpInterceptorFn = (req, next) => {
  const url = 'https://cookuisines.onrender.com/';
  const notificationService = inject(NotificationService);

  const timer = setTimeout(() => {
    notificationService.setWaitingState(true);
  }, 10000);

  const api_request = req.clone({ url: url + req.url });

  return next(api_request).pipe(
    catchError((err) => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);
      return throwError(() => err);
    }),
    finalize(() => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);
    })
  );
};
