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
import { ActivatedRoute, Router } from '@angular/router';

interface QueryParams {
  title: string;
  ingredient: string;
  breakfast: boolean;
  brunch: boolean;
  lunch: boolean;
  dinner: boolean;
  vegan: boolean;
  glutenfree: boolean;
}

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
    title: new FormControl<string>(''),
    ingredient: new FormControl<string>(''),
    breakfast: new FormControl<boolean>(false),
    brunch: new FormControl<boolean>(false),
    lunch: new FormControl<boolean>(false),
    dinner: new FormControl<boolean>(false),
    vegan: new FormControl<boolean>(false),
    glutenfree: new FormControl<boolean>(false),
  });

  constructor(
    private recipeService: RecipeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchRecipes(this.router.url.replace('/', ''));
    this.route.queryParams.subscribe((params) => {
      Object.keys(params).forEach((key) => {
        this.searchForm.get(key)?.setValue(params[key]);
      });
    });
  }

  onSearch() {
    const value = this.searchForm.value as QueryParams;

    const queryParams: QueryParams = {
      title: value.title,
      ingredient: value.ingredient,
      breakfast: value.breakfast,
      brunch: value.brunch,
      lunch: value.lunch,
      dinner: value.dinner,
      vegan: value.vegan,
      glutenfree: value.glutenfree,
    };

    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => value)
    );

    this.router.navigate(['recipes'], { queryParams: filteredQueryParams });

    let url = 'recipes/?';

    Object.keys(filteredQueryParams).forEach((key, index) => {
      const param = key as keyof QueryParams;

      if (index > 0 && !url.endsWith('?')) {
        url += '&';
      }

      url += `${param}=${queryParams[param]}`;
    });

    this.fetchRecipes(url, true);
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
