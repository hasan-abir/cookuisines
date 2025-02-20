import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';

import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { Observable, timer } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let compiled: HTMLElement;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const signupAndLoginSpy = jasmine.createSpyObj('AuthService', [
      'signup',
      'login',
      'setVerifiedState',
      'verifyAndSetVerifiedUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: signupAndLoginSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component with the form elements', () => {
    const form = compiled.querySelector('form');
    const usernameInput = compiled.querySelector(
      'input[formControlName="username"]'
    );
    const emailInput = compiled.querySelector('input[formControlName="email"]');
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    );
    const submitBtn = compiled.querySelector('button[type="submit"]');
    const loginLink = compiled.querySelector('a[routerLink="/login"]');

    expect(form).toBeTruthy();
    expect(usernameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
    expect(loginLink).toBeTruthy();
  });

  it('should signup and redirect', fakeAsync(() => {
    spyOn(router, 'navigate');
    authServiceSpy.signup.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.complete();
        });
      })
    );
    authServiceSpy.login.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    const usernameInput = compiled.querySelector(
      'input[formControlName="username"]'
    ) as HTMLInputElement;
    const emailInput = compiled.querySelector(
      'input[formControlName="email"]'
    ) as HTMLInputElement;
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;
    const submitBtn = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    const username = 'test_user';
    const email = 'test@test.com';
    const password = 'testtest';

    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event('input'));
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));

    submitBtn.click();

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    expect(authServiceSpy.signup.calls.count()).toBe(1);
    expect(authServiceSpy.login.calls.count()).toBe(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/recipemaker']);
  }));

  it('should signup and show signup error', fakeAsync(() => {
    const usernameErr = 'Username error';
    const emailErr = 'Email error';
    const passwordErr = 'Password error';

    authServiceSpy.signup.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({
            error: {
              username: [usernameErr],
              email: [emailErr],
              password: [passwordErr],
            },
          });
        });
      })
    );

    const usernameInput = compiled.querySelector(
      'input[formControlName="username"]'
    ) as HTMLInputElement;
    const emailInput = compiled.querySelector(
      'input[formControlName="email"]'
    ) as HTMLInputElement;
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;
    const submitBtn = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    const username = 'test_user';
    const email = 'test@test.com';
    const password = 'testtest';

    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event('input'));
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));

    submitBtn.click();

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.classList).not.toContain('is-loading');

    expect(authServiceSpy.signup.calls.count()).toBe(1);

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(usernameErr);
    expect(msgs[1]?.textContent?.trim()).toBe(emailErr);
    expect(msgs[2]?.textContent?.trim()).toBe(passwordErr);
  }));

  it('should signup and show login error', fakeAsync(() => {
    const errMsg = 'Message';

    authServiceSpy.signup.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );
    authServiceSpy.login.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({ error: { detail: errMsg } });
        });
      })
    );

    const usernameInput = compiled.querySelector(
      'input[formControlName="username"]'
    ) as HTMLInputElement;
    const emailInput = compiled.querySelector(
      'input[formControlName="email"]'
    ) as HTMLInputElement;
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;
    const submitBtn = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    const username = 'test_user';
    const email = 'test@test.com';
    const password = 'testtest';

    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event('input'));
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));

    submitBtn.click();

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.classList).not.toContain('is-loading');

    expect(authServiceSpy.signup.calls.count()).toBe(1);
    expect(authServiceSpy.login.calls.count()).toBe(1);

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(errMsg);
  }));
});
