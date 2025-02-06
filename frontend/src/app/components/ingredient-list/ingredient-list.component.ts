import { Component, Input } from '@angular/core';
import {
  IngredientResponse,
  PaginatedIngredients,
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
  paginatedIngredients: PaginatedIngredients = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchIngredients();
  }

  fetchMoreIngredients() {
    if (this.paginatedIngredients.next) {
      this.fetchIngredients(this.paginatedIngredients.next);
    }
  }

  fetchIngredients(nextUrl?: string) {
    this.isProcessing = true;

    this.recipeService.get_ingredients(nextUrl || this.url).subscribe({
      next: (result) => {
        this.paginatedIngredients.count = result.count;
        this.paginatedIngredients.next = result.next;
        this.paginatedIngredients.previous = result.previous;

        this.paginatedIngredients.results = [
          ...this.paginatedIngredients.results,
          ...result.results,
        ];

        this.isProcessing = false;
      },
    });
  }
}
