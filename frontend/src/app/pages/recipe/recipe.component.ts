import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BasepageComponent } from '../../components/basepage/basepage.component';
import { DietarypreferenceListComponent } from '../../components/dietarypreference-list/dietarypreference-list.component';
import { IngredientListComponent } from '../../components/ingredient-list/ingredient-list.component';
import { InstructionListComponent } from '../../components/instruction-list/instruction-list.component';
import { MealtypeListComponent } from '../../components/mealtype-list/mealtype-list.component';
import {
  DietaryPreferenceResponse,
  IngredientResponse,
  InstructionResponse,
  MealTypeResponse,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';

interface RecipeDetails {
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
    MealtypeListComponent,
    DietarypreferenceListComponent,
    IngredientListComponent,
    InstructionListComponent,
    BasepageComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent {
  recipe: RecipeResponse | null = null;
  isProcessing = false;
  recipeDetails: RecipeDetails = {};
  isRecipeFullyLoaded: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchRecipe();
  }

  formatDuration(duration: string) {
    const [hours, minutes, seconds] = duration
      .split(':')
      .map((time) => parseInt(time, 10));

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

  setRecipeDetails<K extends keyof RecipeDetails>(
    key: K,
    val: RecipeDetails[K]
  ) {
    this.recipeDetails[key] = val;

    const isFullyLoaded =
      this.recipe !== null &&
      this.recipeDetails.hasOwnProperty('ingredients') &&
      this.recipeDetails.hasOwnProperty('instructions') &&
      this.recipeDetails.hasOwnProperty('meal_type') &&
      this.recipeDetails.hasOwnProperty('dietary_preference');

    if (isFullyLoaded) {
      this.isRecipeFullyLoaded = true;
      this.cd.detectChanges();
    }
  }
}
