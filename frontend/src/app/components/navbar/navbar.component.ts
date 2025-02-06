import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user$ = this.authService.user$;
  isActive = false;

  constructor(private authService: AuthService, private router: Router) {}

  logoutUser() {
    const clearUser = () => {
      this.authService.setUserState(null);
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
