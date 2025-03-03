import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import {
  Duration,
  RecipecreateoreditComponent,
} from './recipecreateoredit.component';
import { RecipemakerComponent } from '../../pages/recipemaker/recipemaker.component';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { Observable, timer } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { globalAPIInterceptor } from '../../interceptors/global_api.interceptor';

describe('RecipecreateoreditComponent', () => {
  let component: RecipecreateoreditComponent;
  let fixture: ComponentFixture<RecipecreateoreditComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    const createMethodsSpy = jasmine.createSpyObj('RecipeService', [
      'create_recipe',
      'create_ingredient',
      'create_instruction',
      'create_mealtype',
      'create_dietarypreference',
    ]);

    await TestBed.configureTestingModule({
      imports: [RecipecreateoreditComponent],
      providers: [
        provideHttpClient(withInterceptors([globalAPIInterceptor])),
        provideHttpClientTesting(),
        { provide: RecipeService, useValue: createMethodsSpy },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    fixture = TestBed.createComponent(RecipecreateoreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should render component with the correct form elements', () => {
    const titleLabel = compiled.querySelector("label[for='title']");
    const titleInput = compiled.querySelector("input[formControlName='title']");
    const difficultyLabel = compiled.querySelector("label[for='difficulty']");
    const difficultySelect = compiled.querySelector(
      "select[formControlName='difficulty']"
    );
    const easyOption = compiled.querySelector("option[value='easy']");
    const mediumOption = compiled.querySelector("option[value='medium']");
    const hardOption = compiled.querySelector("option[value='hard']");
    const submitBtn = compiled.querySelector("button[type='submit']");

    expect(titleLabel?.textContent).toBe('Title*');
    expect(titleInput).toBeTruthy();
    expect(difficultyLabel?.textContent).toBe('Difficulty');
    expect(difficultySelect).toBeTruthy();
    expect(easyOption).toBeTruthy();
    expect(mediumOption).toBeTruthy();
    expect(hardOption).toBeTruthy();
    expect(submitBtn).toBeTruthy();
  });

  it('should update the form when title and difficulty are set', () => {
    const titleInput = compiled.querySelector(
      "input[formControlName='title']"
    ) as HTMLInputElement;
    const difficultySelect = compiled.querySelector(
      "select[formControlName='difficulty']"
    ) as HTMLSelectElement;

    const title = 'Yo DOt';
    const difficulty = 'medium';
    titleInput.value = title;
    difficultySelect.value = difficulty;
    titleInput.dispatchEvent(new Event('input'));
    difficultySelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.makerForm.get('title')?.value).toBe(title);
    expect(component.makerForm.get('difficulty')?.value).toBe(difficulty);
  });

  it('should reset the form after successful submit', fakeAsync(() => {
    const recipeResponse: RecipeResponse = {
      url: 'http://testserver/recipes/123/',
      title: 'New recipe',
      preparation_time: '00:01:40',
      cooking_time: '01:30:00',
      difficulty: 'easy',
      ingredients: 'http://testserver/recipes/123/ingredients/',
      instructions: 'http://testserver/recipes/123/instructions/',
      meal_type: 'http://testserver/recipes/mealtypes/123/',
      dietary_preference: 'http://testserver/recipes/dietarypreferences/123/',
      created_by_username: 'hasan_abir',
      image_id: '456',
      image_url: 'http://testserver/images/123',
    };

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next(recipeResponse);
      })
    );

    recipeServiceSpy.create_ingredient.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_instruction.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_mealtype.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_dietarypreference.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.complete();
        });
      })
    );

    component.makerForm.setValue({
      title: 'Yo dot',
      cookingTime: { hours: 0, minutes: 1, seconds: 0 },
      preparationTime: { hours: 0, minutes: 1, seconds: 0 },
      dietaryPreference: { glutenfree: false, vegan: true },
      difficulty: 'hard',
      image: new File([''], 'test-image.png', { type: 'image/png' }),
      ingredients: [],
      instructions: [],
      mealType: {
        breakfast: true,
        brunch: false,
        lunch: false,
        dinner: false,
      },
    });
    (component.makerForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl('Yo dot'),
        quantity: new FormControl('I got you'),
      })
    );
    (component.makerForm.get('instructions') as FormArray).push(
      new FormGroup({
        step: new FormControl('Imma do my shtuff'),
      })
    );
    fixture.detectChanges();

    const value = component.makerForm.value;

    const submitBtn = compiled.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.classList).not.toContain('is-loading');

    expect(recipeServiceSpy.create_recipe).toHaveBeenCalledWith({
      title: value.title as string,
      preparation_time: value.preparationTime
        ? component.formatDuration(value.preparationTime as Duration)
        : '',
      cooking_time: value.preparationTime
        ? component.formatDuration(value.cookingTime as Duration)
        : '',
      difficulty: value.difficulty as 'easy' | 'medium' | 'hard',
      image: value.image as File,
    });

    expect(recipeServiceSpy.create_ingredient).toHaveBeenCalledWith(
      recipeResponse.ingredients,
      (value.ingredients as IngredientBody[])[0]
    );
    expect(recipeServiceSpy.create_instruction).toHaveBeenCalledWith(
      recipeResponse.instructions,
      (value.instructions as InstructionBody[])[0]
    );
    expect(recipeServiceSpy.create_mealtype).toHaveBeenCalledWith({
      ...value.mealType,
      recipe: recipeResponse.url,
    } as MealTypeBody);
    expect(recipeServiceSpy.create_dietarypreference).toHaveBeenCalledWith({
      ...value.dietaryPreference,
      recipe: recipeResponse.url,
    } as DietaryPreferenceBody);

    expect(component.makerForm.get('title')?.value).toBeFalsy();
    expect(component.makerForm.get('cookingTime')?.value).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(component.makerForm.get('preparationTime')?.value).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(component.makerForm.get('dietaryPreference')?.value).toEqual({
      glutenfree: false,
      vegan: false,
    });
    expect(component.makerForm.get('difficulty')?.value).toBe('easy');
    expect(component.makerForm.get('image')?.value).toBe(null);
    expect(component.makerForm.get('ingredients')?.value).toEqual([]);
    expect(component.makerForm.get('instructions')?.value).toEqual([]);
    expect(component.makerForm.get('mealType')?.value).toEqual({
      breakfast: false,
      brunch: false,
      lunch: false,
      dinner: false,
    });
  }));

  it('should display the recipe error', fakeAsync(() => {
    const recipeError = { detail: "I ain't got you dot" };

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({ error: recipeError });
        });
      })
    );

    recipeServiceSpy.create_ingredient.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_instruction.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_mealtype.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_dietarypreference.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    component.makerForm.setValue({
      title: 'Yo dot',
      cookingTime: { hours: 0, minutes: 1, seconds: 0 },
      preparationTime: { hours: 0, minutes: 1, seconds: 0 },
      dietaryPreference: { glutenfree: false, vegan: true },
      difficulty: 'hard',
      image: new File([''], 'test-image.png', { type: 'image/png' }),
      ingredients: [],
      instructions: [],
      mealType: {
        breakfast: true,
        brunch: false,
        lunch: false,
        dinner: false,
      },
    });
    (component.makerForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl('Yo dot'),
        quantity: new FormControl('I got you'),
      })
    );
    (component.makerForm.get('instructions') as FormArray).push(
      new FormGroup({
        step: new FormControl('Imma do my shtuff'),
      })
    );
    fixture.detectChanges();

    const submitBtn = compiled.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.classList).not.toContain('is-loading');

    expect(recipeServiceSpy.create_recipe).toHaveBeenCalled();

    expect(recipeServiceSpy.create_ingredient).not.toHaveBeenCalled();
    expect(recipeServiceSpy.create_instruction).not.toHaveBeenCalled();
    expect(recipeServiceSpy.create_mealtype).not.toHaveBeenCalled();
    expect(recipeServiceSpy.create_dietarypreference).not.toHaveBeenCalled();

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(recipeError.detail);
  }));

  it('should display the recipe nested error', fakeAsync(() => {
    const recipeResponse: RecipeResponse = {
      url: 'http://testserver/recipes/123/',
      title: 'New recipe',
      preparation_time: '00:01:40',
      cooking_time: '01:30:00',
      difficulty: 'easy',
      ingredients: 'http://testserver/recipes/123/ingredients/',
      instructions: 'http://testserver/recipes/123/instructions/',
      meal_type: 'http://testserver/recipes/mealtypes/123/',
      dietary_preference: 'http://testserver/recipes/dietarypreferences/123/',
      created_by_username: 'hasan_abir',
      image_id: '456',
      image_url: 'http://testserver/images/123',
    };
    const ingredientError = { detail: 'Ingredient error' };

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next(recipeResponse);
      })
    );

    recipeServiceSpy.create_ingredient.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({
            error: ingredientError,
          });
        });
      })
    );

    recipeServiceSpy.create_instruction.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_mealtype.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    recipeServiceSpy.create_dietarypreference.and.returnValue(
      new Observable((subscriber) => {
        subscriber.complete();
      })
    );

    component.makerForm.setValue({
      title: 'Yo dot',
      cookingTime: { hours: 0, minutes: 1, seconds: 0 },
      preparationTime: { hours: 0, minutes: 1, seconds: 0 },
      dietaryPreference: { glutenfree: false, vegan: true },
      difficulty: 'hard',
      image: new File([''], 'test-image.png', { type: 'image/png' }),
      ingredients: [],
      instructions: [],
      mealType: {
        breakfast: true,
        brunch: false,
        lunch: false,
        dinner: false,
      },
    });
    (component.makerForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl('Yo dot'),
        quantity: new FormControl('I got you'),
      })
    );
    (component.makerForm.get('instructions') as FormArray).push(
      new FormGroup({
        step: new FormControl('Imma do my shtuff'),
      })
    );
    fixture.detectChanges();

    const submitBtn = compiled.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    submitBtn.click();
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.classList).toContain('is-loading');

    tick(2000);

    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
    expect(submitBtn.classList).not.toContain('is-loading');

    expect(recipeServiceSpy.create_recipe).toHaveBeenCalled();

    expect(recipeServiceSpy.create_ingredient).toHaveBeenCalled();
    expect(recipeServiceSpy.create_instruction).toHaveBeenCalled();
    expect(recipeServiceSpy.create_mealtype).toHaveBeenCalled();
    expect(recipeServiceSpy.create_dietarypreference).toHaveBeenCalled();

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(ingredientError.detail);
  }));
  it('should display title err', () => {
    const errEl = compiled.querySelector('.help');

    expect(errEl?.textContent?.trim()).toBe(
      'You might not bother with it, but a proper title is a must'
    );
  });
});
