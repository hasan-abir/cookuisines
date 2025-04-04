import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { durationStringToObj } from '../../../utils/time.utils';
import { BasepageComponent } from '../../components/basepage/basepage.component';
import { RecipecreateoreditComponent } from '../../components/recipecreateoredit/recipecreateoredit.component';
import { AuthService } from '../../services/auth.service';
import {
  DietaryPreferenceResponse,
  IngredientResponse,
  InstructionResponse,
  MealTypeResponse,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';

export interface RecipeDetails {
  ingredients?: IngredientResponse[];
  instructions?: InstructionResponse[];
  meal_type?: MealTypeResponse;
  dietary_preference?: DietaryPreferenceResponse;
}

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    BasepageComponent,
    RecipecreateoreditComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent {
  recipe: RecipeResponse | null = null;
  isProcessing = false;
  isEditing = false;
  isDeleting = false;
  user$ = this.authService.user$;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchRecipe();
  }

  formatDuration(duration: string) {
    const { hours, minutes, seconds } = durationStringToObj(duration);

    const parts = [];

    if (hours > 0) {
      const label = hours === 1 ? 'hour' : 'hours';
      parts.push(`${hours} ${label}`);
    }

    if (minutes > 0) {
      const label = minutes === 1 ? 'minute' : 'minutes';
      parts.push(`${minutes} ${label}`);
    }

    if (seconds > 0) {
      const label = seconds === 1 ? 'second' : 'seconds';
      parts.push(`${seconds} ${label}`);
    }

    return parts.join(', ');
  }

  fetchRecipe() {
    this.isProcessing = true;

    const id = this.route.snapshot.paramMap.get('id') as string;

    this.recipeService.get_recipe(id).subscribe({
      next: (result) => {
        this.recipe = result;

        this.isProcessing = false;
      },
    });
  }

  toggleIsEditing() {
    this.isEditing = !this.isEditing;
  }

  toggleIsDeleting() {
    this.isDeleting = !this.isDeleting;
  }

  confirmDelete() {
    if (this.recipe) {
      const url = this.recipe.url;

      this.isProcessing = true;
      this.recipe = null;

      this.recipeService.delete_recipe(url).subscribe({
        next: () => {
          this.isProcessing = false;

          this.router.navigate(['/recipes']);
        },
      });
    }
  }

  setEditedRecipe(recipe: RecipeResponse) {
    this.isEditing = false;

    this.recipe = recipe;
  }
}
