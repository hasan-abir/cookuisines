import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authenticated$ = this.authService.authenticated$;
  isActive = false;

  constructor(private authService: AuthService, private router: Router) {}

  logoutUser() {
    const clearUser = () => {
      this.authService.setAuthenticatedState(false);
      this.authService.setVerifyingState(false);
      this.router.navigate(['/login']);
    };

    this.authService.setVerifyingState(true);

    this.authService.logout().subscribe({
      error: (err) => {
        clearUser();
      },
      complete: () => {
        clearUser();
      },
    });
  }
}
