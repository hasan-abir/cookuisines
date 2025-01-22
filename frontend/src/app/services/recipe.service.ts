import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  name: string;
  quantity: string;
}

export interface IngredientResponse extends IngredientBody {
  url: string;
}

export interface InstructionBody {
  step: string;
}

export interface InstructionResponse extends InstructionBody {
  url: string;
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

  create_ingredient(
    url: string,
    body: IngredientBody
  ): Observable<IngredientResponse> {
    return this.http.post<IngredientResponse>(url, body, {
      withCredentials: true,
    });
  }

  create_instruction(
    url: string,
    body: InstructionBody
  ): Observable<InstructionResponse> {
    return this.http.post<InstructionResponse>(url, body, {
      withCredentials: true,
    });
  }

  create_mealtype(body: MealTypeBody): Observable<MealTypeResponse> {
    return this.http.post<MealTypeResponse>('recipes/mealtypes/', body, {
      withCredentials: true,
    });
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
}
