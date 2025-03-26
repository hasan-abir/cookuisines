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
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { createFormControl, shortenObj } from '../../../utils/form.utils';
import { durationStringToObj } from '../../../utils/time.utils';
import { globalAPIInterceptor } from '../../interceptors/global_api.interceptor';
import {
  DietaryPreferenceResponse,
  DietaryPreferences,
  MealTypeResponse,
  MealTypes,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { MakerFormVal } from '../../types/MakerForm';
import {
  FullRecipe,
  RecipecreateoreditComponent,
} from './recipecreateoredit.component';
import { Router } from '@angular/router';

const getDemoRecipe = (id = 123, title = 'New recipe'): RecipeResponse => {
  return {
    url: `https://testserver/recipes/${id}/`,
    title,
    preparation_time: '00:01:40',
    cooking_time: '01:30:00',
    difficulty: 'easy',
    ingredient_list: [
      'First ingredient',
      'Second ingredient',
      'Third ingredient',
    ],
    instruction_steps: ['First step', 'Second step', 'Third step'],
    meal_types: ['Breakfast'],
    dietary_preferences: ['Gluten free'],
    created_by_username: 'hasan_abir',
    image_id: '456',
    image_url: 'https://testserver/images/123',
  };
};

const getDemoMakerForm = () => {
  const formBuilder = new FormBuilder();
  const ingredients = ['Yo dot', 'I got you'];
  const instructions = ['Ima do my shtuff', 'Say what drake?'];

  return {
    title: 'Yo dot',
    cookingTime: { hours: 0, minutes: 1, seconds: 0 },
    preparationTime: { hours: 0, minutes: 1, seconds: 0 },
    dietaryPreference: { glutenfree: false, vegan: true },
    difficulty: 'hard',
    image: new File([''], 'test-image.png', { type: 'image/png' }),
    ingredients: ingredients.map((item) =>
      formBuilder.group({ nameQuantity: createFormControl(item) })
    ),
    instructions: instructions.map((item) =>
      formBuilder.group({ step: createFormControl(item) })
    ),
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
  let router: Router;

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
    router = TestBed.inject(Router);
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
    spyOn(router, 'navigate');
    spyOn(component.recipeEdited, 'emit');

    const recipeResponse: RecipeResponse = getDemoRecipe();

    recipeServiceSpy.create_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next(recipeResponse);
        });
      })
    );

    const { ingredients, instructions, ...demoMakerForm } = getDemoMakerForm();

    component.makerForm.patchValue(demoMakerForm);

    ingredients.forEach((ingredient) => {
      (component.makerForm.get('ingredients') as FormArray)?.push(ingredient);
    });
    instructions.forEach((instruction) => {
      (component.makerForm.get('instructions') as FormArray)?.push(instruction);
    });

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

    const expectedRecipeBody = {
      title: value.title,
      difficulty: value.difficulty,
      image: value.image,
      preparation_time: component.formatDuration(value.preparationTime),
      cooking_time: component.formatDuration(value.cookingTime),
      ingredient_list: value.ingredients
        .map((ingredient) => ingredient.nameQuantity.trim())
        .join('\r\n'),
      instruction_steps: value.instructions
        .map((instruction) => instruction.step.trim())
        .join('\r\n'),
      meal_types: Object.entries(value.mealType)
        .filter(([k, v]) => v)
        .map(([k, v]) => k) as MealTypes[],
      dietary_preferences: Object.entries(value.dietaryPreference)
        .filter(([k, v]) => v)
        .map(([k, v]) => k) as DietaryPreferences[],
    };

    expect(recipeServiceSpy.create_recipe).toHaveBeenCalledWith(
      expectedRecipeBody
    );

    expect(component.recipeEdited.emit).not.toHaveBeenCalledWith(
      recipeResponse
    );
    expect(router.navigate).toHaveBeenCalledWith([
      '/recipes' + recipeResponse.url.split('/recipes')[1],
    ]);
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

    const { ingredients, instructions, ...demoMakerForm } = getDemoMakerForm();

    component.makerForm.patchValue(demoMakerForm);

    ingredients.forEach((ingredient) => {
      (component.makerForm.get('ingredients') as FormArray)?.push(ingredient);
    });
    instructions.forEach((instruction) => {
      (component.makerForm.get('instructions') as FormArray)?.push(instruction);
    });

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

    const msgs = compiled.querySelectorAll('.message-body');

    expect(msgs[0]?.textContent?.trim()).toBe(recipeError.detail + ' - DETAIL');
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

    const existingRecipe = getDemoRecipe();

    component.existingRecipe = existingRecipe;
    fixture.detectChanges();

    component.setExistingRecipeToForm();
    fixture.detectChanges();

    const imageReq = httpTesting.expectOne(existingRecipe.image_url);
    imageReq.flush(new Blob());

    expect(component.makerForm.value['title']).toBe(existingRecipe.title);
    expect(component.makerForm.value['difficulty']).toBe(
      existingRecipe.difficulty
    );
    expect(component.makerForm.value['image'] instanceof File).toBeTrue();
    expect(component.makerForm.value['preparationTime']).toEqual(
      durationStringToObj(existingRecipe.preparation_time)
    );
    expect(component.makerForm.value['cookingTime']).toEqual(
      durationStringToObj(existingRecipe.cooking_time)
    );
    expect(component.makerForm.value['ingredients']).toEqual(
      existingRecipe.ingredient_list.map((ingredient) => ({
        nameQuantity: ingredient,
      }))
    );
    expect(component.makerForm.value['instructions']).toEqual(
      existingRecipe.instruction_steps.map((instruction) => ({
        step: instruction,
      }))
    );
    const expectedMealTypes = {
      breakfast: false,
      brunch: false,
      lunch: false,
      dinner: false,
    };

    existingRecipe.meal_types
      .map((mealtype) => mealtype.toLowerCase() as MealTypes)
      .forEach((mealtype) => {
        expectedMealTypes[mealtype] = true;
      });

    expect(component.makerForm.value['mealType']).toEqual(expectedMealTypes);
    const expectedDietaryPreferences = {
      vegan: false,
      glutenfree: false,
    };

    existingRecipe.dietary_preferences
      .map(
        (dietaryPreference) =>
          dietaryPreference
            .toLowerCase()
            .replaceAll(' ', '') as DietaryPreferences
      )
      .forEach((dietaryPreference) => {
        expectedDietaryPreferences[dietaryPreference] = true;
      });
    expect(component.makerForm.value['dietaryPreference']).toEqual(
      expectedDietaryPreferences
    );

    expect(component.isEditing).toBe(true);
  });
  it('should call edit on form submission', fakeAsync(() => {
    spyOn(component.recipeEdited, 'emit');

    const existingRecipe = getDemoRecipe();

    component.existingRecipe = existingRecipe;
    component.isEditing = true;
    fixture.detectChanges();

    const recipeResponse: RecipeResponse = getDemoRecipe(123, 'Edited recipe');

    recipeServiceSpy.edit_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next(recipeResponse);
        });
      })
    );

    const { ingredients, instructions, ...demoMakerForm } = getDemoMakerForm();

    component.makerForm.patchValue(demoMakerForm);

    ingredients.forEach((ingredient) => {
      (component.makerForm.get('ingredients') as FormArray)?.push(ingredient);
    });
    instructions.forEach((instruction) => {
      (component.makerForm.get('instructions') as FormArray)?.push(instruction);
    });

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

    const expectedRecipeBody = {
      title: value.title,
      difficulty: value.difficulty,
      image: value.image,
      preparation_time: component.formatDuration(value.preparationTime),
      cooking_time: component.formatDuration(value.cookingTime),
      ingredient_list: value.ingredients
        .map((ingredient) => ingredient.nameQuantity.trim())
        .join('\r\n'),
      instruction_steps: value.instructions
        .map((instruction) => instruction.step.trim())
        .join('\r\n'),
      dietary_preferences: Object.entries(value.dietaryPreference)
        .filter(([k, v]) => v)
        .map(([k, v]) => k) as DietaryPreferences[],
    };
    expect(recipeServiceSpy.edit_recipe).toHaveBeenCalledWith(
      recipeResponse.url,
      expectedRecipeBody
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
