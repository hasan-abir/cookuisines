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
import { handleErrors } from '../../../utils/error.utils';
import { BasepageComponent } from '../../components/basepage/basepage.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BasepageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isProcessing = false;
  errMsgs: string[] = [];

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
      this.errMsgs = [];
      this.isProcessing = true;

      this.authService.login(this.loginForm.value as LoginBody).subscribe({
        error: (err) => {
          this.errMsgs = handleErrors(err);
          this.loginForm.reset();
          this.isProcessing = false;
        },
        complete: () => {
          this.authService.setVerifiedState(false);
          this.router.navigate(['/recipemaker']);
        },
      });
    }
  }
}
