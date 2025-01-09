import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, switchMap, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const globalAPIInterceptor: HttpInterceptorFn = (req, next) => {
  const url = 'https://cookuisines.onrender.com/';
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const timer = setTimeout(() => {
    notificationService.setWaitingState(true);
  }, 10000);

  const api_request = req.clone({ url: url + req.url });

  return next(api_request).pipe(
    catchError((err: HttpErrorResponse) => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);

      if (err.status === 401) {
        return authService.refresh().pipe(
          switchMap(() => {
            return next(api_request);
          }),
          catchError((refreshErr) => {
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    }),
    finalize(() => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);
    })
  );
};
