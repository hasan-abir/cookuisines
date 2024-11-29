import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

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
    const makerLink = compiled.querySelectorAll('a')[3];
    const signupLink = compiled.querySelectorAll('a')[4];
    const loginLink = compiled.querySelectorAll('a')[5];

    expect(homeLink.getAttribute('routerLink')).toBe('/');
    expect(recipesLink.getAttribute('routerLink')).toBe('/recipes');
    expect(makerLink.getAttribute('routerLink')).toBe('/recipemaker');
    expect(signupLink.getAttribute('routerLink')).toBe('/signup');
    expect(loginLink.getAttribute('routerLink')).toBe('/login');
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
