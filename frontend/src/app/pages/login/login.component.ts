import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { handleErrors } from '../../../utils/error.utils';
import { BasepageComponent } from '../../components/basepage/basepage.component';
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
    private router: Router,
    private route: ActivatedRoute
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
        complete: async () => {
          await this.authService.verifyAndSetVerifiedUser();

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          if (returnUrl) {
            this.router.navigate([returnUrl]);
          } else {
            this.router.navigate(['/recipemaker']);
          }
        },
      });
    }
  }
}
