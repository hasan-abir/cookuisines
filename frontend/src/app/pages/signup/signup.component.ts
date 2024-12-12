import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, SignupBody } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isProcessing = false;
  errMsgs: string[] = [];

  signupForm = this.formBuilder.group({
    username: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.signupForm.valid) {
      this.errMsgs = [];
      this.isProcessing = true;

      this.authService.signup(this.signupForm.value as SignupBody).subscribe({
        error: (err) => {
          err.error &&
            err.error.username &&
            this.errMsgs.push(err.error.username[0]);

          err.error && err.error.email && this.errMsgs.push(err.error.email[0]);

          err.error &&
            err.error.password &&
            this.errMsgs.push(err.error.password[0]);

          this.isProcessing = false;
        },
        complete: () => {
          this.authService
            .login({
              username: this.signupForm.value.username as string,
              password: this.signupForm.value.password as string,
            })
            .subscribe({
              error: (err) => {
                err.error &&
                  err.error.detail &&
                  this.errMsgs.push(err.error.detail);

                this.signupForm.reset();
                this.isProcessing = false;
              },
              complete: () => {
                this.router.navigate(['/recipemaker']);
              },
            });
        },
      });
    }
  }
}
