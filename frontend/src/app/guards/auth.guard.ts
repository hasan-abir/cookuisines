import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, finalize, firstValueFrom, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const attemptingToLogin =
    route.url[0].path === 'login' || route.url[0].path === 'signup';

  const verifyUser = () => {
    authService.setVerifyingState(true);

    return firstValueFrom(
      authService.verify().pipe(
        map((value) => {
          authService.setAuthenticatedState(true);
        }),
        catchError((err) => {
          authService.setAuthenticatedState(false);
          return of(false);
        }),
        finalize(async () => {
          authService.setVerifiedState(true);
          authService.setVerifyingState(false);
        })
      )
    );
  };

  const isVerified = await firstValueFrom(authService.verified$);

  if (!isVerified) {
    await verifyUser();
  }

  const isAuthenticated = await firstValueFrom(authService.authenticated$);

  if (isAuthenticated && attemptingToLogin) {
    router.navigate(['/recipemaker']);
    return false;
  } else if (
    (isAuthenticated && !attemptingToLogin) ||
    (!isAuthenticated && attemptingToLogin)
  ) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
