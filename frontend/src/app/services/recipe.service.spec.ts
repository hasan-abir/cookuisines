import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { combineLatest } from 'rxjs';
import {
  domain,
  globalAPIInterceptor,
} from '../interceptors/global_api.interceptor';
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

    const req = httpTesting.expectOne(domain + 'recipes/' + id + '/');
    expect(req.request.method).toBe('GET');
  });

  it('get_recipes: should call API', () => {
    service.get_recipes().subscribe();

    let req = httpTesting.expectOne(domain + 'recipes/');
    expect(req.request.method).toBe('GET');

    const url = 'abc/';

    service.get_recipes(url).subscribe();

    req = httpTesting.expectOne(domain + '' + url);
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
      ingredient_list:
        'First ingredient\r\nSecond ingredient\r\nThird ingredient',
      instruction_steps: 'First step\r\nSecond step\r\nThird step',
      meal_types: ['breakfast'],
      dietary_preferences: ['glutenfree'],
    };

    Object.keys(body).forEach((val) => {
      const key = val as keyof RecipeBody;
      const value = body[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    });

    service.create_recipe(body).subscribe();

    const req = httpTesting.expectOne(domain + 'recipes/');
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
      ingredient_list:
        'First ingredient\r\nSecond ingredient\r\nThird ingredient',
      instruction_steps: 'First step\r\nSecond step\r\nThird step',
      meal_types: ['breakfast'],
      dietary_preferences: ['glutenfree'],
    };

    Object.keys(body).forEach((val) => {
      const key = val as keyof RecipeBody;
      const value = body[key];

      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value as string | File);
      }
    });

    service.edit_recipe(url, body).subscribe();

    const req = httpTesting.expectOne(`${domain}${url}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(formData);
  });
});
