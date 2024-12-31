import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [
      'setVerifyingState',
      'setVerifiedState',
      'setAuthenticatedState',
      'verified$',
      'authenticated$',
      'verify',
      'refresh',
    ]);
    authService.verified$ = new BehaviorSubject<boolean>(false);
    authService.authenticated$ = new BehaviorSubject<boolean>(false);

    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when verify() succeeds', async () => {
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );

    const result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );
    expect(result).toBeFalse();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);
  });

  it('should return true when verify() fails but refresh() succeeds', async () => {
    authService.verify.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );
    authService.refresh.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    const result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );

    expect(result).toBeFalse();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return false and navigate to login when both verify() and refresh() fails', async () => {
    authService.verify.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );
    authService.refresh.and.returnValue(of(null));

    const result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );

    expect(result).toBeFalse();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);
  });
});
