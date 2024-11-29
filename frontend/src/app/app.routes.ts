import { Routes } from '@angular/router';
import { RecipemakerComponent } from './pages/recipemaker/recipemaker.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recipemaker', component: RecipemakerComponent },
  { path: '', component: HomeComponent },
];
