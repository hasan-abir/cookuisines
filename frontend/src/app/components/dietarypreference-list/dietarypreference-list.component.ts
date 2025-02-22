import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DietaryPreferenceResponse,
  MealTypeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { RecipeDetails } from '../../pages/recipe/recipe.component';

@Component({
  selector: 'app-dietarypreference-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dietarypreference-list.component.html',
  styleUrl: './dietarypreference-list.component.css',
})
export class DietarypreferenceListComponent {
  isProcessing = false;
  dietarypreference: DietaryPreferenceResponse | null = null;
  @Output() setDietaryPreference =
    new EventEmitter<DietaryPreferenceResponse>();

  @Input() loadedRecipe: RecipeDetails = {};

  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    if (this.loadedRecipe.dietary_preference) {
      this.dietarypreference = this.loadedRecipe.dietary_preference;
    } else {
      this.fetchDietarypreference();
    }
  }

  fetchDietarypreference() {
    this.isProcessing = true;

    this.recipeService.get_dietarypreference(this.url).subscribe({
      next: (result) => {
        this.dietarypreference = result;

        this.isProcessing = false;

        this.setDietaryPreference.emit(result);
      },
    });
  }
}
