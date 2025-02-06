import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { IngredientListComponent } from './ingredient-list.component';
import { RecipeService } from '../../services/recipe.service';
import { Observable, timer } from 'rxjs';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', [
      'get_ingredients',
    ]);

    await TestBed.configureTestingModule({
      imports: [IngredientListComponent],
      providers: [{ provide: RecipeService, useValue: getMethodSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    recipeServiceSpy.get_ingredients.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next({
          count: 0,
          previous: null,
          next: null,
          results: [],
        });
      })
    );

    fixture = TestBed.createComponent(IngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled = fixture.nativeElement;
  });

  it('should fetch the ingredients and display the ingredients array', fakeAsync(() => {
    const ingredientsUrl = 'ingredients-url';
    component.url = ingredientsUrl;

    let ingredientsLi = compiled.querySelectorAll('li');

    expect(ingredientsLi.length).toBe(0);

    const names = ['Ingredient 1', 'Ingredient 2'];
    const quantities = ['Quantity 1', 'Quantity 2'];

    recipeServiceSpy.get_ingredients.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            count: 0,
            previous: null,
            next: null,
            results: [
              {
                url: 'http://testserver/recipes/ingredients/1/',
                name: names[0],
                quantity: quantities[0],
              },
              {
                url: 'http://testserver/recipes/ingredients/2/',
                name: names[1],
                quantity: quantities[1],
              },
            ],
          });
        });
      })
    );

    component.fetchIngredients();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    expect(recipeServiceSpy.get_ingredients).toHaveBeenCalledWith(
      ingredientsUrl
    );

    ingredientsLi = compiled.querySelectorAll('li');

    expect(ingredientsLi.length).toBe(2);
    expect(ingredientsLi[0].textContent?.trim()).toBe(
      names[0] + ' - ' + quantities[0]
    );
    expect(ingredientsLi[1].textContent?.trim()).toBe(
      names[1] + ' - ' + quantities[1]
    );
  }));
  it('should fetch more ingredients', fakeAsync(() => {
    const nextPage = 'http://testserver/ingredients/?page=2';
    component.paginatedIngredients.next = nextPage;
    fixture.detectChanges();
    const names = ['Ingredient 1', 'Ingredient 2'];
    const quantities = ['Quantity 1', 'Quantity 2'];
    recipeServiceSpy.get_ingredients.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            count: 2,
            next: null,
            previous: null,
            results: [
              {
                url: 'http://testserver/recipes/ingredients/1/',
                name: names[0],
                quantity: quantities[0],
              },
              {
                url: 'http://testserver/recipes/ingredients/2/',
                name: names[1],
                quantity: quantities[1],
              },
            ],
          });
        });
      })
    );
    const moreIngredientsBtn = compiled.querySelector(
      '.fetch-more-ingredients'
    ) as HTMLButtonElement;
    expect(moreIngredientsBtn).toBeTruthy();
    moreIngredientsBtn.click();
    fixture.detectChanges();
    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();
    tick(2000);
    fixture.detectChanges();
    const ingredientsLi = compiled.querySelectorAll('li');
    loader = compiled.querySelector('.loader');
    expect(recipeServiceSpy.get_ingredients).toHaveBeenCalledWith(nextPage);
    expect(ingredientsLi.length).toBe(2);
    expect(loader).toBeFalsy();
  }));
});
