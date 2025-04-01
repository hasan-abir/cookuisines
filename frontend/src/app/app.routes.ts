import { Routes } from '@angular/router';
import { RecipemakerComponent } from './pages/recipemaker/recipemaker.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { authGuard } from './guards/auth.guard';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  {
    path: 'recipemaker',
    component: RecipemakerComponent,
    canActivate: [authGuard],
  },
  { path: 'recipes/:id', component: RecipeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/not-found' },
];
