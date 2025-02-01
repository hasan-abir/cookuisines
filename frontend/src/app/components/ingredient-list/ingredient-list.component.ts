import { Component, Input } from '@angular/core';
import {
  IngredientResponse,
  RecipeService,
} from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css',
})
export class IngredientListComponent {
  isProcessing = false;
  ingredients: IngredientResponse[] = [];
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchIngredients();
  }

  fetchIngredients() {
    this.isProcessing = true;

    this.recipeService.get_ingredients(this.url).subscribe({
      next: (result) => {
        this.ingredients = result.results;

        this.isProcessing = false;
      },
    });
  }
}
