import { Component } from '@angular/core';
import { PaginatedRecipes, RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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

  searchForm = this.formBuilder.group({
    title: new FormControl<string | null>(null),
  });

  constructor(
    private recipeService: RecipeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchRecipes(this.router.url.replace('/', ''));
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.router.navigate(['recipes'], {
        queryParams: { title: this.searchForm.value.title },
      });

      this.fetchRecipes('recipes/?title=' + this.searchForm.value.title, true);
    }
  }

  fetchMoreRecipes() {
    if (this.paginatedRecipes.next) {
      this.fetchRecipes(this.paginatedRecipes.next);
    }
  }

  fetchRecipes(url?: string, refresh?: boolean) {
    this.isProcessing = true;

    this.recipeService.get_recipes(url).subscribe({
      next: (result) => {
        this.paginatedRecipes.count = result.count;
        this.paginatedRecipes.next = result.next;
        this.paginatedRecipes.previous = result.previous;

        if (refresh) {
          this.paginatedRecipes.results = [...result.results];
        } else {
          this.paginatedRecipes.results = [
            ...this.paginatedRecipes.results,
            ...result.results,
          ];
        }

        this.isProcessing = false;
      },
      error: (err) => {
        this.isProcessing = false;
      },
    });
  }
}
