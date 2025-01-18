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
