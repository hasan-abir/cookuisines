import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

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
});
