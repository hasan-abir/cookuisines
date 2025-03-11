import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MakerFormVal } from '../types/MakerForm';

interface BaseRecipe {
  title: string;
  preparation_time: string;
  cooking_time: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RecipeBody extends BaseRecipe {
  image: File;
}

export interface RecipeResponse extends BaseRecipe {
  url: string;
  ingredients: string;
  instructions: string;
  meal_type: string;
  dietary_preference: string;
  created_by_username: string;
  image_id: string;
  image_url: string;
}

export interface PaginatedRecipes {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecipeResponse[];
}

export interface IngredientBody {
  url?: string;
  name: string;
  quantity: string;
}

export interface IngredientResponse extends IngredientBody {
  url: string;
}

export interface PaginatedIngredients {
  count: number;
  next: string | null;
  previous: string | null;
  results: IngredientResponse[];
}

export interface InstructionBody {
  url?: string;
  step: string;
}

export interface InstructionResponse extends InstructionBody {
  url: string;
}

export interface PaginatedInstructions {
  count: number;
  next: string | null;
  previous: string | null;
  results: InstructionResponse[];
}

export interface MealTypeBody {
  recipe: string;
  breakfast?: boolean;
  brunch?: boolean;
  lunch?: boolean;
  dinner?: boolean;
}

export interface MealTypeResponse extends MealTypeBody {
  url: string;
}

export interface DietaryPreferenceBody {
  recipe: string;
  vegan?: boolean;
  glutenfree?: boolean;
}

export interface DietaryPreferenceResponse extends DietaryPreferenceBody {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  get_recipe(id: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>('recipes/' + id + '/');
  }

  get_recipes(url?: string): Observable<PaginatedRecipes> {
    return this.http.get<PaginatedRecipes>(url || 'recipes/');
  }

  create_recipe(body: RecipeBody): Observable<RecipeResponse> {
    const formData = new FormData();

    Object.keys(body).forEach((val) => {
      const key = val as keyof RecipeBody;

      formData.append(key, body[key]);
    });

    return this.http.post<RecipeResponse>('recipes/', formData, {
      withCredentials: true,
    });
  }

  edit_recipe(url: string, body: RecipeBody): Observable<RecipeResponse> {
    const formData = new FormData();

    Object.keys(body).forEach((val) => {
      const key = val as keyof RecipeBody;

      formData.append(key, body[key]);
    });

    return this.http.patch<RecipeResponse>(url, formData, {
      withCredentials: true,
    });
  }

  get_ingredients(url: string): Observable<PaginatedIngredients> {
    return this.http.get<PaginatedIngredients>(url);
  }

  create_ingredient(
    ingredientUrl: string,
    body: IngredientBody
  ): Observable<IngredientResponse> {
    const { url, ...rest } = body;
    return this.http.post<IngredientResponse>(ingredientUrl, rest, {
      withCredentials: true,
    });
  }

  edit_ingredient(body: IngredientBody): Observable<IngredientResponse> {
    const { url, ...rest } = body;

    return this.http.patch<IngredientResponse>(url as string, rest, {
      withCredentials: true,
    });
  }

  get_instructions(url: string): Observable<PaginatedInstructions> {
    return this.http.get<PaginatedInstructions>(url);
  }

  create_instruction(
    instructionUrl: string,
    body: InstructionBody
  ): Observable<InstructionResponse> {
    const { url, ...rest } = body;

    return this.http.post<InstructionResponse>(instructionUrl, rest, {
      withCredentials: true,
    });
  }

  edit_instruction(body: InstructionBody): Observable<InstructionResponse> {
    const { url, ...rest } = body;
    return this.http.patch<InstructionResponse>(url as string, rest, {
      withCredentials: true,
    });
  }

  get_mealtype(url: string): Observable<MealTypeResponse> {
    return this.http.get<MealTypeResponse>(url);
  }

  create_mealtype(body: MealTypeBody): Observable<MealTypeResponse> {
    return this.http.post<MealTypeResponse>('recipes/mealtypes/', body, {
      withCredentials: true,
    });
  }

  edit_mealtype(url: string, body: MealTypeBody): Observable<MealTypeResponse> {
    return this.http.patch<MealTypeResponse>(url, body, {
      withCredentials: true,
    });
  }

  get_dietarypreference(url: string): Observable<DietaryPreferenceResponse> {
    return this.http.get<DietaryPreferenceResponse>(url);
  }

  create_dietarypreference(
    body: DietaryPreferenceBody
  ): Observable<DietaryPreferenceResponse> {
    return this.http.post<DietaryPreferenceResponse>(
      'recipes/dietarypreferences/',
      body,
      {
        withCredentials: true,
      }
    );
  }

  edit_dietarypreference(
    body: DietaryPreferenceResponse
  ): Observable<DietaryPreferenceResponse> {
    const { url, ...rest } = body;

    return this.http.patch<DietaryPreferenceResponse>(url, rest, {
      withCredentials: true,
    });
  }

  createNestedRecipeRequests(
    recipe: RecipeResponse,
    value: MakerFormVal
  ): Observable<any>[] {
    return [
      ...value.ingredients.map((ingredient) =>
        this.create_ingredient(recipe.ingredients, ingredient)
      ),
      ...value.instructions.map((instruction) =>
        this.create_instruction(recipe.instructions, instruction)
      ),
      this.create_mealtype({
        recipe: recipe.url,
        ...value.mealType,
      }),
      this.create_dietarypreference({
        recipe: recipe.url,
        ...value.dietaryPreference,
      }),
    ];
  }

  editNestedRecipeRequests(
    recipe: RecipeResponse,
    value: MakerFormVal
  ): Observable<any>[] {
    return [
      ...value.ingredients.map((ingredient) =>
        ingredient.url ? this.edit_ingredient(ingredient) : of(undefined)
      ),
      ...value.instructions.map((instruction) =>
        instruction.url ? this.edit_instruction(instruction) : of(undefined)
      ),
      this.edit_mealtype(recipe.meal_type, {
        recipe: recipe.url,
        ...value.mealType,
      }),
      this.edit_mealtype(recipe.dietary_preference, {
        recipe: recipe.url,
        ...value.dietaryPreference,
      }),
    ];
  }
}
