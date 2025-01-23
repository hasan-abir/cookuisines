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

  fetchMoreRecipes() {
    if (this.paginatedRecipes.next) {
      this.fetchRecipes(this.paginatedRecipes.next);
    }
  }

  fetchRecipes(url?: string) {
    this.isProcessing = true;

    this.recipeService.get_recipes(url).subscribe({
      next: (result) => {
        this.paginatedRecipes.count = result.count;
        this.paginatedRecipes.next = result.next;
        this.paginatedRecipes.previous = result.previous;
        this.paginatedRecipes.results = [
          ...this.paginatedRecipes.results,
          ...result.results,
        ];
        this.isProcessing = false;
      },
      error: (err) => {
        this.isProcessing = false;
      },
    });
  }
}
