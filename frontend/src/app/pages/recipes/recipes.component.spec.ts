import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { Observable, timer } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { RecipesComponent } from './recipes.component';

describe('RecipeComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', ['get_recipes']);

    await TestBed.configureTestingModule({
      imports: [RecipesComponent],
      providers: [{ provide: RecipeService, useValue: getMethodSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;

    recipeServiceSpy.get_recipes.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
      })
    );

    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should fetch the recipes', fakeAsync(() => {
    recipeServiceSpy.get_recipes.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            count: 2,
            next: null,
            previous: null,
            results: [
              {
                url: 'http://testserver/recipes/1/',
                title: 'Recipe 1',
                preparation_time: '00:01:40',
                cooking_time: '01:30:00',
                difficulty: 'easy',
                ingredients: 'http://testserver/recipes/123/ingredients/',
                instructions: 'http://testserver/recipes/123/instructions/',
                meal_type: 'http://testserver/recipes/mealtypes/123/',
                dietary_preference:
                  'http://testserver/recipes/dietarypreferences/123/',
                created_by_username: 'hasan_abir',
                image_id: '456',
                image_url: 'http://testserver/images/123',
              },

              {
                url: 'http://testserver/recipes/2/',
                title: 'Recipe 2',
                preparation_time: '00:01:40',
                cooking_time: '01:30:00',
                difficulty: 'easy',
                ingredients: 'http://testserver/recipes/123/ingredients/',
                instructions: 'http://testserver/recipes/123/instructions/',
                meal_type: 'http://testserver/recipes/mealtypes/123/',
                dietary_preference:
                  'http://testserver/recipes/dietarypreferences/123/',
                created_by_username: 'hasan_abir',
                image_id: '456',
                image_url: 'http://testserver/images/123',
              },
            ],
          });
        });
      })
    );
    component.fetchRecipes();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();
    const recipes = compiled.querySelectorAll('.cell');
    const noMoreRecipes = compiled.querySelector('.no-more-recipes');
    loader = compiled.querySelector('.loader');
    expect(recipeServiceSpy.get_recipes).toHaveBeenCalled();
    expect(recipes.length).toBe(2);
    expect(noMoreRecipes).toBeTruthy();
    expect(loader).toBeFalsy();
  }));

  it('should fetch more recipes', fakeAsync(() => {
    const nextPage = 'http://testserver/recipes/1?page=2';
    component.paginatedRecipes.next = nextPage;
    fixture.detectChanges();

    recipeServiceSpy.get_recipes.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            count: 2,
            next: null,
            previous: null,
            results: [
              {
                url: 'http://testserver/recipes/1/',
                title: 'Recipe 1',
                preparation_time: '00:01:40',
                cooking_time: '01:30:00',
                difficulty: 'easy',
                ingredients: 'http://testserver/recipes/123/ingredients/',
                instructions: 'http://testserver/recipes/123/instructions/',
                meal_type: 'http://testserver/recipes/mealtypes/123/',
                dietary_preference:
                  'http://testserver/recipes/dietarypreferences/123/',
                created_by_username: 'hasan_abir',
                image_id: '456',
                image_url: 'http://testserver/images/123',
              },

              {
                url: 'http://testserver/recipes/2/',
                title: 'Recipe 2',
                preparation_time: '00:01:40',
                cooking_time: '01:30:00',
                difficulty: 'easy',
                ingredients: 'http://testserver/recipes/123/ingredients/',
                instructions: 'http://testserver/recipes/123/instructions/',
                meal_type: 'http://testserver/recipes/mealtypes/123/',
                dietary_preference:
                  'http://testserver/recipes/dietarypreferences/123/',
                created_by_username: 'hasan_abir',
                image_id: '456',
                image_url: 'http://testserver/images/123',
              },
            ],
          });
        });
      })
    );
    const moreRecipesBtn = compiled.querySelector(
      '.fetch-more-recipe'
    ) as HTMLButtonElement;

    expect(moreRecipesBtn).toBeTruthy();
    moreRecipesBtn.click();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();
    const recipes = compiled.querySelectorAll('.cell');
    const noMoreRecipes = compiled.querySelector('.no-more-recipes');
    loader = compiled.querySelector('.loader');
    expect(recipeServiceSpy.get_recipes).toHaveBeenCalledWith(nextPage);
    expect(recipes.length).toBe(2);
    expect(noMoreRecipes).toBeTruthy();
    expect(loader).toBeFalsy();
  }));

  it('should disable loader when there is an error in fetching', fakeAsync(() => {
    recipeServiceSpy.get_recipes.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.error({ error: { detail: 'Some error' } });
        });
      })
    );
    component.fetchRecipes();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();
    loader = compiled.querySelector('.loader');
    expect(loader).toBeFalsy();
  }));
});
