import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { Duration, RecipemakerComponent } from './recipemaker.component';

describe('RecipemakerComponent', () => {
  let component: RecipemakerComponent;
  let fixture: ComponentFixture<RecipemakerComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const createMethodsSpy = jasmine.createSpyObj('RecipeService', [
      'create_recipe',
      'create_ingredient',
      'create_instruction',
      'create_mealtype',
      'create_dietarypreference',
    ]);

    await TestBed.configureTestingModule({
      imports: [RecipemakerComponent],
      providers: [{ provide: RecipeService, useValue: createMethodsSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    fixture = TestBed.createComponent(RecipemakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
