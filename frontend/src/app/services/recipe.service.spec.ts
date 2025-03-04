import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeBody,
  RecipeResponse,
  RecipeService,
} from './recipe.service';
import { globalAPIInterceptor } from '../interceptors/global_api.interceptor';
import { MakerFormVal } from '../types/MakerForm';
import { combineLatest } from 'rxjs';

describe('RecipesService', () => {
  let service: RecipeService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([globalAPIInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RecipeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('get_recipe: should call API', () => {
    const id = '123';

    service.get_recipe(id).subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/recipes/' + id + '/'
    );
    expect(req.request.method).toBe('GET');
  });

  it('get_recipes: should call API', () => {
    service.get_recipes().subscribe();

    let req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/recipes/'
    );
    expect(req.request.method).toBe('GET');

    const url = 'abc/';

    service.get_recipes(url).subscribe();

    req = httpTesting.expectOne('https://cookuisines.onrender.com/' + url);
    expect(req.request.method).toBe('GET');
  });

  it('create_recipe: should call API', () => {
    const formData = new FormData();

    const body: RecipeBody = {
      title: 'Title',
      preparation_time: 'time',
      cooking_time: 'time',
      difficulty: 'hard',
      image: new File([''], 'test-image.png', { type: 'image/png' }),
    };

    Object.keys(body).forEach((val) => {
      const key = val as keyof RecipeBody;

      formData.append(key, body[key]);
    });

    service.create_recipe(body).subscribe();

    const req = httpTesting.expectOne(
      'https://cookuisines.onrender.com/recipes/'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formData);
  });

  it('get_ingredients: should call API', () => {
    const url = 'ingredients';

    service.get_ingredients(url).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('GET');
  });

  it('create_ingredient: should call API', () => {
    const url = 'recipes/123/ingredients/';
    const body: IngredientBody = {
      name: 'Name',
      quantity: '2',
    };
    service.create_ingredient(url, body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('get_instructions: should call API', () => {
    const url = 'instructions';

    service.get_instructions(url).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('GET');
  });

  it('create_instruction: should call API', () => {
    const url = 'recipes/123/instructions/';
    const body: InstructionBody = {
      step: 'Step',
    };
    service.create_instruction(url, body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('get_mealtype: should call API', () => {
    const url = 'mealtype';

    service.get_mealtype(url).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('GET');
  });

  it('create_mealtype: should call API', () => {
    const url = 'recipes/mealtypes/';
    const body: MealTypeBody = {
      recipe: '/recipes/123',
      breakfast: true,
      dinner: true,
    };
    service.create_mealtype(body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('get_dietarypreference: should call API', () => {
    const url = 'dietarypreference';

    service.get_dietarypreference(url).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('GET');
  });

  it('create_dietarypreference: should call API', () => {
    const url = 'recipes/dietarypreferences/';
    const body: DietaryPreferenceBody = {
      recipe: '/recipes/123',
      vegan: true,
    };
    service.create_dietarypreference(body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(body);
  });

  it('createNestedRecipeRequests: should call API', () => {
    const recipe = {
      url: 'recipes/123',
      ingredients: 'recipes/123/ingredients',
      instructions: 'recipes/123/instructions',
      meal_type: 'recipes/mealtypes/123',
      dietary_preference: 'recipes/dietarypreferences/123',
    } as RecipeResponse;

    const value = {
      ingredients: [
        {
          name: 'Ingredient 1',
          quantity: '3',
        },
        {
          name: 'Ingredient 2',
          quantity: '2',
        },
      ],
      instructions: [
        {
          step: 'Instruction 1',
        },
        {
          step: 'Instruction 2',
        },
      ],
      mealType: {
        breakfast: false,
        brunch: true,
        lunch: false,
        dinner: false,
      },
      dietaryPreference: {
        vegan: false,
        glutenfree: true,
      },
    } as MakerFormVal;

    combineLatest(
      service.createNestedRecipeRequests(recipe, value)
    ).subscribe();

    const ingredientReq = httpTesting.match({
      url: `https://cookuisines.onrender.com/${recipe.ingredients}`,
      method: 'POST',
    });
    expect(ingredientReq.length).toBe(2);
    expect(ingredientReq[0].request.body).toBe(value.ingredients[0]);
    expect(ingredientReq[1].request.body).toBe(value.ingredients[1]);

    const instructionReq = httpTesting.match({
      url: `https://cookuisines.onrender.com/${recipe.instructions}`,
      method: 'POST',
    });
    expect(instructionReq.length).toBe(2);
    expect(instructionReq[0].request.body).toBe(value.instructions[0]);
    expect(instructionReq[1].request.body).toBe(value.instructions[1]);

    const mealTypeReq = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/recipes/mealtypes/`,
      method: 'POST',
    });
    expect(mealTypeReq.request.body).toEqual({
      recipe: recipe.url,
      ...value.mealType,
    });

    const dietaryPreferenceReq = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/recipes/dietarypreferences/`,
      method: 'POST',
    });
    expect(dietaryPreferenceReq.request.body).toEqual({
      recipe: recipe.url,
      ...value.dietaryPreference,
    });
  });
});
