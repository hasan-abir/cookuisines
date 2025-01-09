import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should not run verify() when isVerified', async () => {
    (authService.verified$ as BehaviorSubject<boolean>).next(true);
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );

    await executeGuard({ url: [{ path: 'recipemaker' }] } as any, null as any);
    expect(authService.verify).not.toHaveBeenCalled();
  });

  it('should return false when verify() succeeds, not authenticated, and not attempting to login', async () => {
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );

    let result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );
    expect(authService.verify).toHaveBeenCalled();
    expect(result).toBeFalse();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true when verify() succeeds, authenticated, not authenticated, and not attempting to login', async () => {
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );
    (authService.authenticated$ as BehaviorSubject<boolean>).next(true);

    let result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );
    expect(authService.verify).toHaveBeenCalled();
    expect(result).toBeTrue();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);

    (authService.authenticated$ as BehaviorSubject<boolean>).next(false);

    result = await executeGuard(
      { url: [{ path: 'login' }] } as any,
      null as any
    );
    expect(result).toBeTrue();
  });

  it('should return false when verify() succeeds, authenticated, and attempting to login', async () => {
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );
    (authService.authenticated$ as BehaviorSubject<boolean>).next(true);

    const result = await executeGuard(
      { url: [{ path: 'login' }] } as any,
      null as any
    );
    expect(authService.verify).toHaveBeenCalled();
    expect(result).toBeFalse();

    expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
    expect(authService.setVerifyingState).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/recipemaker']);
  });
});
