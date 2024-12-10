import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, LoginBody } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isProcessing = false;
  errMsg = '';

  loginForm = this.formBuilder.group({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.errMsg = '';
      this.isProcessing = true;

      this.authService.login(this.loginForm.value as LoginBody).subscribe({
        error: (err) => {
          this.errMsg = err.error && err.error.detail;
          this.loginForm.reset();
          this.isProcessing = false;
        },
        complete: () => {
          this.router.navigate(['/recipemaker']);
        },
      });
    }
  }
}
