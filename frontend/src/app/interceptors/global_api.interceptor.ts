import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const globalAPIInterceptor: HttpInterceptorFn = (req, next) => {
  const domain = 'https://cookuisines.onrender.com/';
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const timer = setTimeout(() => {
    notificationService.setWaitingState(true);
  }, 10000);

  const fullUrl = req.url.includes('https://') ? req.url : domain + req.url;
  const api_request = req.clone({ url: fullUrl });

  return next(api_request).pipe(
    catchError((err: HttpErrorResponse) => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);
      const failStatuses = [401, 0];
      if (failStatuses.includes(err.status)) {
        return authService.refresh().pipe(
          switchMap(() => {
            return next(api_request);
          }),
          catchError((refreshErr) => {
            return throwError(() => refreshErr);
          })
        );
      } else if (err.status === 404) {
        router.navigate(['/not-found']);
      }

      return throwError(() => err);
    }),
    finalize(() => {
      clearTimeout(timer);
      notificationService.setWaitingState(false);
    })
  );
};
