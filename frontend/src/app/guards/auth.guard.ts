import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.setVerifyingState(true);
  return authService.verify().pipe(
    map(() => {
      authService.setVerifyingState(false);
      return true;
    }),
    catchError((err) => {
      return authService.refresh().pipe(
        map(() => {
          authService.setVerifyingState(false);
          return true;
        }),
        catchError((err) => {
          router.navigate(['/login']);

          authService.setVerifyingState(false);
          return of(false);
        })
      );
    })
  );
};
