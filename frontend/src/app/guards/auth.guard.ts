import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, finalize, firstValueFrom, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const location = inject(Location);

  const attemptingToLogin =
    route.url[0].path === 'login' || route.url[0].path === 'signup';

  const isVerified = await firstValueFrom(authService.verified$);

  if (!isVerified) {
    await authService.verifyAndSetVerifiedUser();
  }

  const isAuthenticated = await firstValueFrom(authService.user$);

  if (isAuthenticated && attemptingToLogin) {
    const isDirectEntry = !location.getState();

    if (isDirectEntry) {
      router.navigate(['/recipemaker']);
    }

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
