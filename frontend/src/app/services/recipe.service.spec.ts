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
  RecipeService,
} from './recipe.service';
import { globalAPIInterceptor } from '../interceptors/global_api.interceptor';

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
});
