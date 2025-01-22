import { Component } from '@angular/core';
import { PaginatedRecipes, RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  isProcessing = false;
  paginatedRecipes: PaginatedRecipes = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchRecipes();
  }

  fetchRecipes() {
    this.isProcessing = true;

    this.recipeService.get_recipes().subscribe({
      next: (result) => {
        this.paginatedRecipes = { ...result };
        this.isProcessing = false;
      },
      error: (err) => {
        this.isProcessing = false;
      },
    });
  }
}
