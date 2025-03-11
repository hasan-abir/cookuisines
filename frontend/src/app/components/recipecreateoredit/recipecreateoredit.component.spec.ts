import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { globalAPIInterceptor } from '../../interceptors/global_api.interceptor';
import {
  DietaryPreferenceResponse,
  IngredientResponse,
  InstructionResponse,
  MealTypeResponse,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { MakerFormVal } from '../../types/MakerForm';
import {
  FullRecipe,
  RecipecreateoreditComponent,
} from './recipecreateoredit.component';
import { durationStringToObj } from '../../../utils/time.utils';
import { shortenObj } from '../../../utils/form.utils';

const getDemoRecipe = (id = 123): RecipeResponse => {
  return {
    url: `https://testserver/recipes/${id}/`,
    title: 'New recipe',
    preparation_time: '00:01:40',
    cooking_time: '01:30:00',
    difficulty: 'easy',
    ingredients: 'https://testserver/recipes/123/ingredients/',
    instructions: 'https://testserver/recipes/123/instructions/',
    meal_type: 'https://testserver/recipes/mealtypes/123/',
    dietary_preference: 'https://testserver/recipes/dietarypreferences/123/',
    created_by_username: 'hasan_abir',
    image_id: '456',
    image_url: 'https://testserver/images/123',
  };
};

const getDemoIngredient = (id = 123): IngredientResponse => {
  return {
    url: `https://testserver/recipes/123/ingredients/${id}/`,
    name: 'Yo dot',
    quantity: 'I got you',
  };
};

const getDemoInstruction = (id = 123): InstructionResponse => {
  return {
    url: `https://testserver/recipes/123/instructions/${id}/`,
    step: 'Yo dot',
  };
};

const getDemoMealtype = (id = 123): MealTypeResponse => {
  return {
    url: `https://testserver/recipes/mealtypes/${id}/`,
    recipe: `https://testserver/recipes/${id}/`,
    breakfast: true,
    brunch: false,
    lunch: false,
    dinner: false,
  };
};

const getDemoDietaryPreference = (id = 123): DietaryPreferenceResponse => {
  return {
    url: `https://testserver/recipes/mealtypes/${id}/`,
    recipe: `https://testserver/recipes/${id}/`,
    vegan: true,
    glutenfree: false,
  };
};

const getDemoMakerForm = (): MakerFormVal => {
  return {
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
  };
};

describe('RecipecreateoreditComponent', () => {
  let component: RecipecreateoreditComponent;
  let fixture: ComponentFixture<RecipecreateoreditComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    const createMethodsSpy = jasmine.createSpyObj('RecipeService', [
      'create_recipe',
      'createNestedRecipeRequests',
      'edit_recipe',
      'editNestedRecipeRequests',
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
    const recipeResponse: RecipeResponse = getDemoRecipe();

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next(recipeResponse);
      })
    );

    recipeServiceSpy.createNestedRecipeRequests.and.returnValue([
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.complete();
        });
      }),
    ]);

    component.makerForm.setValue(getDemoMakerForm());
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

    const value = component.makerForm.value as MakerFormVal;

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
      title: value.title,
      preparation_time: component.formatDuration(value.preparationTime),
      cooking_time: component.formatDuration(value.cookingTime),
      difficulty: value.difficulty,
      image: value.image,
    });

    expect(recipeServiceSpy.createNestedRecipeRequests).toHaveBeenCalledWith(
      recipeResponse,
      value
    );

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

    recipeServiceSpy.createNestedRecipeRequests.and.returnValue([
      new Observable((subscriber) => {
        subscriber.complete();
      }),
    ]);

    component.makerForm.setValue(getDemoMakerForm());
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

    expect(recipeServiceSpy.createNestedRecipeRequests).not.toHaveBeenCalled();

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(recipeError.detail);
  }));

  it('should display the recipe nested error', fakeAsync(() => {
    const recipeResponse: RecipeResponse = getDemoRecipe();
    const ingredientError = { detail: 'Ingredient error' };

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next(recipeResponse);
      })
    );

    recipeServiceSpy.createNestedRecipeRequests.and.returnValue([
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({
            error: ingredientError,
          });
        });
      }),
    ]);

    component.makerForm.setValue(getDemoMakerForm());
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

    expect(recipeServiceSpy.createNestedRecipeRequests).toHaveBeenCalled();

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(ingredientError.detail);
  }));
  it('should display title err', () => {
    const errEl = compiled.querySelector('.help');

    expect(errEl?.textContent?.trim()).toBe(
      'You might not bother with it, but a proper title is a must'
    );
  });

  it('should set existing recipe', () => {
    component.setExistingRecipeToForm();
    fixture.detectChanges();

    expect(component.isEditing).toBe(false);
    expect(component.makerForm.value).toEqual({
      title: '',
      cookingTime: { hours: 0, minutes: 0, seconds: 0 },
      preparationTime: { hours: 0, minutes: 0, seconds: 0 },
      dietaryPreference: { glutenfree: false, vegan: false },
      difficulty: 'easy',
      image: null,
      ingredients: [],
      instructions: [],
      mealType: {
        breakfast: false,
        brunch: false,
        lunch: false,
        dinner: false,
      },
    });

    const fullRecipe: FullRecipe = {
      main: getDemoRecipe(),
      details: {
        ingredients: [getDemoIngredient()],
        instructions: [getDemoInstruction()],
        meal_type: getDemoMealtype(),
        dietary_preference: getDemoDietaryPreference(),
      },
    };

    component.fullRecipe = fullRecipe;
    fixture.detectChanges();

    component.setExistingRecipeToForm();
    fixture.detectChanges();

    const imageReq = httpTesting.expectOne(fullRecipe.main.image_url);
    imageReq.flush(new Blob());

    expect(component.makerForm.value['title']).toBe(fullRecipe.main.title);
    expect(component.makerForm.value['difficulty']).toBe(
      fullRecipe.main.difficulty
    );
    expect(component.makerForm.value['image'] instanceof File).toBeTrue();
    expect(component.makerForm.value['preparationTime']).toEqual(
      durationStringToObj(fullRecipe.main.preparation_time)
    );
    expect(component.makerForm.value['cookingTime']).toEqual(
      durationStringToObj(fullRecipe.main.cooking_time)
    );
    expect(component.makerForm.value['ingredients']).toEqual(
      fullRecipe.details.ingredients
    );
    expect(component.makerForm.value['instructions']).toEqual(
      fullRecipe.details.instructions
    );
    expect(component.makerForm.value['mealType']).toEqual(
      shortenObj(fullRecipe.details.meal_type as MealTypeResponse, [
        'breakfast',
        'brunch',
        'lunch',
        'dinner',
      ])
    );
    expect(component.makerForm.value['dietaryPreference']).toEqual(
      shortenObj(
        fullRecipe.details.dietary_preference as DietaryPreferenceResponse,
        ['vegan', 'glutenfree']
      )
    );

    expect(component.isEditing).toBe(true);
  });
  it('should call edit on form submission', fakeAsync(() => {
    const fullRecipe: FullRecipe = {
      main: getDemoRecipe(),
      details: {
        ingredients: [getDemoIngredient()],
        instructions: [getDemoInstruction()],
        meal_type: getDemoMealtype(),
        dietary_preference: getDemoDietaryPreference(),
      },
    };

    component.fullRecipe = fullRecipe;
    component.isEditing = true;
    fixture.detectChanges();

    const recipeResponse: RecipeResponse = getDemoRecipe();

    recipeServiceSpy.edit_recipe.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next(recipeResponse);
      })
    );

    recipeServiceSpy.editNestedRecipeRequests.and.returnValue([
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.complete();
        });
      }),
    ]);

    component.makerForm.setValue(getDemoMakerForm());
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

    const value = component.makerForm.value as MakerFormVal;

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

    expect(recipeServiceSpy.edit_recipe).toHaveBeenCalledWith(
      recipeResponse.url,
      {
        title: value.title,
        preparation_time: component.formatDuration(value.preparationTime),
        cooking_time: component.formatDuration(value.cookingTime),
        difficulty: value.difficulty,
        image: value.image,
      }
    );

    expect(recipeServiceSpy.editNestedRecipeRequests).toHaveBeenCalledWith(
      recipeResponse,
      value
    );

    expect(component.makerForm.get('title')?.value).toBeTruthy();
    expect(component.makerForm.get('cookingTime')?.value).not.toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(component.makerForm.get('preparationTime')?.value).not.toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(component.makerForm.get('dietaryPreference')?.value).not.toEqual({
      glutenfree: false,
      vegan: false,
    });
    expect(component.makerForm.get('difficulty')?.value).not.toBe('easy');
    expect(component.makerForm.get('image')?.value).not.toBe(null);
    expect(component.makerForm.get('ingredients')?.value).not.toEqual([]);
    expect(component.makerForm.get('instructions')?.value).not.toEqual([]);
    expect(component.makerForm.get('mealType')?.value).not.toEqual({
      breakfast: false,
      brunch: false,
      lunch: false,
      dinner: false,
    });
  }));
});
