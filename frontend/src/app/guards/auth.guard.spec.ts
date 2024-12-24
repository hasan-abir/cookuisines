import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
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
      'verify',
    ]);
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

  it('should return true when verify() succeeds', () => {
    authService.verify.and.returnValue(
      of({ username: 'hasan_abir', email: 'hasanabir@test.com' })
    );

    (executeGuard(null as any, null as any) as Observable<any>).subscribe(
      (result) => {
        expect(result).toBeTrue();

        expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
        expect(authService.setVerifyingState).toHaveBeenCalledWith(false);

        expect(router.navigate).not.toHaveBeenCalled();
      }
    );
  });

  it('should return false and navigate to login when verify() fails', () => {
    authService.verify.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    (executeGuard(null as any, null as any) as Observable<any>).subscribe(
      (result) => {
        expect(result).toBeFalse();

        expect(authService.setVerifyingState).toHaveBeenCalledWith(true);
        expect(authService.setVerifyingState).toHaveBeenCalledWith(false);

        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }
    );
  });
});
