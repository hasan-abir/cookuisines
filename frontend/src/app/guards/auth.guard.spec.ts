import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { AuthService, UserResponse } from '../services/auth.service';
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
      'setUserState',
      'verified$',
      'user$',
      'verify',
      'refresh',
      'verifyAndSetVerifiedUser',
    ]);
    authService.verified$ = new BehaviorSubject<boolean>(false);
    authService.user$ = new BehaviorSubject<UserResponse | null>(null);

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
    authService.verifyAndSetVerifiedUser.and.returnValue(Promise.resolve(null));

    let result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );
    expect(authService.verifyAndSetVerifiedUser).toHaveBeenCalled();
    expect(result).toBeFalse();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true when verify() succeeds, authenticated, not authenticated, and not attempting to login', async () => {
    authService.verifyAndSetVerifiedUser.and.returnValue(Promise.resolve(null));

    (authService.user$ as BehaviorSubject<UserResponse | null>).next({
      username: 'test',
      email: 'test@test.com',
    });

    let result = await executeGuard(
      { url: [{ path: 'recipemaker' }] } as any,
      null as any
    );
    expect(authService.verifyAndSetVerifiedUser).toHaveBeenCalled();
    expect(result).toBeTrue();

    (authService.user$ as BehaviorSubject<UserResponse | null>).next(null);

    result = await executeGuard(
      { url: [{ path: 'login' }] } as any,
      null as any
    );
    expect(result).toBeTrue();
  });

  it('should return false when verify() succeeds, authenticated, and attempting to login', async () => {
    authService.verifyAndSetVerifiedUser.and.returnValue(Promise.resolve(null));
    (authService.user$ as BehaviorSubject<UserResponse | null>).next({
      username: 'test',
      email: 'test@test.com',
    });

    const result = await executeGuard(
      { url: [{ path: 'login' }] } as any,
      null as any
    );
    expect(authService.verifyAndSetVerifiedUser).toHaveBeenCalled();
    expect(result).toBeFalse();

    expect(router.navigate).toHaveBeenCalledWith(['/recipemaker']);
  });
});
