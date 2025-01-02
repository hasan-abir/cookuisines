import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  const timer = setTimeout(() => {
    notificationService.setWaitingState(true);
  }, 10000);

  return next(req).pipe(
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
