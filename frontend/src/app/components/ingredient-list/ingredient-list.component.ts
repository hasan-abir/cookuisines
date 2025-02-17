import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IngredientResponse,
  PaginatedIngredients,
  RecipeService,
} from '../../services/recipe.service';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css',
})
export class IngredientListComponent {
  isProcessing = false;
  paginatedIngredients: PaginatedIngredients = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  @Output() setIngredients = new EventEmitter<IngredientResponse[]>();
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchIngredients();
  }

  fetchIngredients(nextUrl?: string) {
    this.isProcessing = true;
    const fetchUrl = nextUrl || this.url;

    this.recipeService.get_ingredients(fetchUrl).subscribe({
      next: (result) => {
        this.paginatedIngredients.count = result.count;
        this.paginatedIngredients.next = result.next;
        this.paginatedIngredients.previous = result.previous;

        this.paginatedIngredients.results = [
          ...this.paginatedIngredients.results,
          ...result.results,
        ];

        this.isProcessing = false;

        if (result.next) {
          this.fetchIngredients(result.next);
        } else {
          this.setIngredients.emit(this.paginatedIngredients.results);
        }
      },
    });
  }
}
