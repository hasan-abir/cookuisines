import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authenticatedSpy = jasmine.createSpyObj('AuthService', [
      'authenticated$',
    ]);

    authenticatedSpy.authenticated$ = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authenticatedSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component with the correct links', () => {
    const homeLink = compiled.querySelectorAll('a')[0];
    const recipesLink = compiled.querySelectorAll('a')[2];
    const signupLink = compiled.querySelectorAll('a')[3];
    const loginLink = compiled.querySelectorAll('a')[4];

    expect(homeLink.getAttribute('routerLink')).toBe('/');
    expect(recipesLink.getAttribute('routerLink')).toBe('/recipes');
    expect(signupLink.getAttribute('routerLink')).toBe('/signup');
    expect(loginLink.getAttribute('routerLink')).toBe('/login');
  });

  it('should render component with the correct links when authenticated', () => {
    (authServiceSpy.authenticated$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();

    const homeLink = compiled.querySelectorAll('a')[0];
    const recipesLink = compiled.querySelectorAll('a')[2];
    const makerLink = compiled.querySelectorAll('a')[3];

    expect(homeLink.getAttribute('routerLink')).toBe('/');
    expect(recipesLink.getAttribute('routerLink')).toBe('/recipes');
    expect(makerLink.getAttribute('routerLink')).toBe('/recipemaker');
  });

  it('should open the hamburger menu correctly', () => {
    const burgerBtn = compiled.querySelectorAll('a')[1];
    const menu = compiled.querySelector('.navbar-menu');

    burgerBtn.click();
    fixture.detectChanges();

    expect(burgerBtn.classList.contains('is-active')).toBeTruthy();
    expect(menu && menu.classList.contains('is-active')).toBeTruthy();
  });
});
