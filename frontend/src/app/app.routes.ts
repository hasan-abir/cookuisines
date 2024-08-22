import { Routes } from '@angular/router';
import { RecipemakerComponent } from './pages/recipemaker/recipemaker.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {path: 'recipemaker', component: RecipemakerComponent},
    {path: '', component: HomeComponent}
];
