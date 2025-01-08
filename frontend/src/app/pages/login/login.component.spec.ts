import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { Observable, timer } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const loginSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setVerifiedState',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: loginSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
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
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    );
    const submitBtn = compiled.querySelector('button[type="submit"]');
    const signupLink = compiled.querySelector('a[routerLink="/signup"]');

    expect(form).toBeTruthy();
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
    expect(signupLink).toBeTruthy();
  });

  it('should login and redirect', fakeAsync(() => {
    spyOn(router, 'navigate');
    authServiceSpy.login.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.complete();
        });
      })
    );

    const usernameInput = compiled.querySelector(
      'input[formControlName="username"]'
    ) as HTMLInputElement;
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;
    const submitBtn = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    const username = 'test_user';
    const password = 'testtest';

    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));

    submitBtn.click();

    fixture.detectChanges();

    expect(submitBtn.classList).toContain('is-loading');
    expect(submitBtn.disabled).toBeTrue();

    tick(2000);

    expect(authServiceSpy.login.calls.count()).toBe(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/recipemaker']);
  }));

  it('should login and show error', fakeAsync(() => {
    const errMsg = 'Message';

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
    const passwordInput = compiled.querySelector(
      'input[formControlName="password"]'
    ) as HTMLInputElement;
    const submitBtn = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    const username = 'test_user';
    const password = 'testtest';

    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event('input'));
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

    expect(authServiceSpy.login.calls.count()).toBe(1);

    const msg = compiled.querySelector('.message-body');

    expect(msg?.textContent?.trim()).toBe(errMsg);
  }));
});
