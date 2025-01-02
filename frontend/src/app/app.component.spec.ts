import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationService } from './services/notification.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const verifySpy = jasmine.createSpyObj('AuthService', ['verifying$']);
    const waitingSpy = jasmine.createSpyObj('NotificationService', [
      'waiting$',
    ]);

    verifySpy.verifying$ = new BehaviorSubject<boolean>(false);
    waitingSpy.waiting$ = new BehaviorSubject<boolean>(false);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: verifySpy },
        { provide: NotificationService, useValue: waitingSpy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the loader', () => {
    (authServiceSpy.verifying$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();
    const modalLoader = fixture.nativeElement.querySelector('.modal');
    expect(modalLoader).toBeTruthy();
  });

  it('should render the notification', () => {
    (notificationServiceSpy.waiting$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();
    const notification = fixture.nativeElement.querySelector('.notification');
    expect(notification).toBeTruthy();
  });
});
