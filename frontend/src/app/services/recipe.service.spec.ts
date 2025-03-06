import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { combineLatest } from 'rxjs';
import { globalAPIInterceptor } from '../interceptors/global_api.interceptor';
import { MakerFormVal } from '../types/MakerForm';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeBody,
  RecipeResponse,
  RecipeService,
} from './recipe.service';

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

  it('edit_recipe: should call API', () => {
    const formData = new FormData();
    const url = 'recipes/123/';
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

    service.edit_recipe(url, body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('PUT');
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
    expect(req.request.body).toEqual(body);
  });

  it('edit_ingredient: should call API', () => {
    const url = 'recipes/123/ingredients/';
    const body: IngredientBody = {
      url,
      name: 'Name',
      quantity: '2',
    };
    service.edit_ingredient(body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('PUT');
    delete body.url;
    expect(req.request.body).toEqual(body);
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
    expect(req.request.body).toEqual(body);
  });

  it('edit_instruction: should call API', () => {
    const url = 'recipes/123/instructions/';
    const body: InstructionBody = {
      url,
      step: 'Step',
    };
    service.edit_instruction(body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('PUT');
    delete body.url;
    expect(req.request.body).toEqual(body);
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

  it('edit_mealtype: should call API', () => {
    const url = 'recipes/mealtypes/';
    const body: MealTypeBody = {
      recipe: '/recipes/123',
      breakfast: true,
      dinner: true,
    };
    service.edit_mealtype(url, body).subscribe();

    const req = httpTesting.expectOne(
      `https://cookuisines.onrender.com/${url}`
    );
    expect(req.request.method).toBe('PUT');
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

  it('edit_dietarypreference: should call API', () => {
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
    expect(ingredientReq[0].request.body).toEqual(value.ingredients[0]);
    expect(ingredientReq[1].request.body).toEqual(value.ingredients[1]);

    const instructionReq = httpTesting.match({
      url: `https://cookuisines.onrender.com/${recipe.instructions}`,
      method: 'POST',
    });
    expect(instructionReq.length).toBe(2);
    expect(instructionReq[0].request.body).toEqual(value.instructions[0]);
    expect(instructionReq[1].request.body).toEqual(value.instructions[1]);

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
  it('editNestedRecipeRequests: should call API', () => {
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
          url: 'recipes/123/ingredients/1',
          name: 'Ingredient 1',
          quantity: '3',
        },
        {
          url: 'recipes/123/ingredients/2',
          name: 'Ingredient 2',
          quantity: '2',
        },
      ],
      instructions: [
        {
          url: 'recipes/123/instructions/1',
          step: 'Instruction 1',
        },
        {
          url: 'recipes/123/instructions/2',
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

    combineLatest(service.editNestedRecipeRequests(recipe, value)).subscribe();

    const ingredient1Req = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${value.ingredients[0].url}`,
      method: 'PUT',
    });
    delete value.ingredients[0].url;
    expect(ingredient1Req.request.body).toEqual(value.ingredients[0]);
    const ingredient2Req = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${value.ingredients[1].url}`,
      method: 'PUT',
    });
    delete value.ingredients[1].url;
    expect(ingredient2Req.request.body).toEqual(value.ingredients[1]);

    const instruction1Req = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${value.instructions[0].url}`,
      method: 'PUT',
    });
    delete value.instructions[0].url;
    expect(instruction1Req.request.body).toEqual(value.instructions[0]);
    const instruction2Req = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${value.instructions[1].url}`,
      method: 'PUT',
    });
    delete value.instructions[1].url;
    expect(instruction2Req.request.body).toEqual(value.instructions[1]);

    const mealTypeReq = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${recipe.meal_type}`,
      method: 'PUT',
    });
    expect(mealTypeReq.request.body).toEqual({
      recipe: recipe.url,
      ...value.mealType,
    });

    const dietaryPreferenceReq = httpTesting.expectOne({
      url: `https://cookuisines.onrender.com/${recipe.dietary_preference}`,
      method: 'PUT',
    });
    expect(dietaryPreferenceReq.request.body).toEqual({
      recipe: recipe.url,
      ...value.dietaryPreference,
    });
  });
});
