import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { routes } from '../../app.routes';
import { AuthService, UserResponse } from '../../services/auth.service';
import { RecipeResponse, RecipeService } from '../../services/recipe.service';
import { RecipeComponent } from './recipe.component';

@Component({
  selector: 'app-mealtype-list',
  template: '',
  standalone: true,
})
class MockMealtypeListComponent {
  @Input() loadedRecipe = {};
  @Input() url = '';
}

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    const recipeSpy = jasmine.createSpyObj('RecipeService', [
      'get_recipe',
      'delete_recipe',
    ]);
    const authenticatedSpy = jasmine.createSpyObj('AuthService', ['user$']);

    authenticatedSpy.user$ = new BehaviorSubject<UserResponse | null>(null);

    await TestBed.configureTestingModule({
      imports: [RecipeComponent],
      providers: [
        provideRouter(routes),
        { provide: RecipeService, useValue: recipeSpy },
        { provide: AuthService, useValue: authenticatedSpy },
      ],
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    route.snapshot.params = { id: '1' };
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    recipeServiceSpy.get_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            url: 'http://testserver/recipes/1/',
            cooking_time: '00:10:00',
            preparation_time: '00:10:00',
            title: 'Recipe 1',
            created_by_username: 'hasan_abir',
            difficulty: 'hard',
            dietary_preferences: ['Gluten free'],
            meal_types: ['Breakfast', 'Brunch'],
            image_id: 'image_id',
            image_url: 'image_url',
            ingredient_list: [
              'First ingredient',
              'Second ingredient',
              'Third ingredient',
            ],
            instruction_steps: ['First step', 'Second step', 'Third step'],
          });
        });
      })
    );
    fixture = TestBed.createComponent(RecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled = fixture.nativeElement;
  });

  it('should fetch the recipe and display the recipe if it exists', fakeAsync(() => {
    let titleHeading = compiled.querySelectorAll('h1')[0];

    expect(titleHeading).toBeFalsy();

    const recipe: RecipeResponse = {
      url: 'http://testserver/recipes/1/',
      cooking_time: '50:00:00',
      preparation_time: '00:05:06',
      title: 'Recipe 1',
      created_by_username: 'hasan_abir',
      difficulty: 'hard',
      dietary_preferences: ['Gluten free'],
      meal_types: ['Breakfast', 'Brunch'],
      image_id: 'image_id',
      image_url: 'image_url',
      ingredient_list: [
        'First ingredient',
        'Second ingredient',
        'Third ingredient',
      ],
      instruction_steps: ['First step', 'Second step', 'Third step'],
    };

    recipeServiceSpy.get_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next(recipe);
        });
      })
    );

    component.fetchRecipe();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    loader = compiled.querySelector('.loader');
    expect(loader).toBeFalsy();
    expect(recipeServiceSpy.get_recipe).toHaveBeenCalledWith('1');

    titleHeading = compiled.querySelectorAll('h1')[0];
    const paragraphs = compiled.querySelectorAll('p');

    expect(paragraphs[0].textContent?.trim()).toBe('5 minutes, 6 seconds');
    expect(paragraphs[1].textContent?.trim()).toBe('50 hours');
    expect(paragraphs[2].textContent?.trim()).toBe(recipe.difficulty);
  }));

  it('should display the edit button when recipe fully loads', fakeAsync(() => {
    let editButton = compiled.querySelectorAll('button')[0];
    let deleteButton = compiled.querySelectorAll('button')[1];

    expect(editButton).toBeFalsy();
    expect(deleteButton).toBeFalsy();

    const user = {
      username: 'test',
      email: 'test@test.com',
    };
    (authServiceSpy.user$ as BehaviorSubject<UserResponse | null>).next(user);

    component.recipe = {
      url: 'http://testserver/recipes/1/',
      cooking_time: '50:00:00',
      preparation_time: '00:05:06',
      title: 'Recipe 1',
      created_by_username: 'hasan_abir',
      difficulty: 'hard',
      dietary_preferences: ['Gluten free'],
      meal_types: ['Breakfast', 'Brunch'],
      image_id: 'image_id',
      image_url: 'image_url',
      ingredient_list: [
        'First ingredient',
        'Second ingredient',
        'Third ingredient',
      ],
      instruction_steps: ['First step', 'Second step', 'Third step'],
    };

    fixture.detectChanges();

    editButton = compiled.querySelectorAll('button')[0];
    deleteButton = compiled.querySelectorAll('button')[1];

    expect(editButton).toBeFalsy();
    expect(deleteButton).toBeFalsy();

    component.recipe.created_by_username = 'test';

    fixture.detectChanges();

    editButton = compiled.querySelectorAll('button')[0];
    deleteButton = compiled.querySelectorAll('button')[1];

    expect(editButton).toBeTruthy();
    expect(editButton.textContent?.trim()).toBe('Edit');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent?.trim()).toBe('Delete');
  }));

  it('should setExistingRecipe and close isEditing', () => {
    const recipe: RecipeResponse = {
      url: 'http://testserver/recipes/1/',
      cooking_time: '50:00:00',
      preparation_time: '00:05:06',
      title: 'Recipe 1',
      created_by_username: 'hasan_abir',
      difficulty: 'hard',
      dietary_preferences: ['Gluten free'],
      meal_types: ['Breakfast', 'Brunch'],
      image_id: 'image_id',
      image_url: 'image_url',
      ingredient_list: [
        'First ingredient',
        'Second ingredient',
        'Third ingredient',
      ],
      instruction_steps: ['First step', 'Second step', 'Third step'],
    };

    component.setEditedRecipe(recipe);

    expect(component.recipe).toEqual(recipe);
    expect(component.isEditing).toBeFalse();
  });

  it('should open and close delete modal ', () => {
    const user = {
      username: 'test',
      email: 'test@test.com',
    };
    (authServiceSpy.user$ as BehaviorSubject<UserResponse | null>).next(user);

    const recipe: RecipeResponse = {
      url: 'http://testserver/recipes/1/',
      cooking_time: '50:00:00',
      preparation_time: '00:05:06',
      title: 'Recipe 1',
      created_by_username: 'test',
      difficulty: 'hard',
      dietary_preferences: ['Gluten free'],
      meal_types: ['Breakfast', 'Brunch'],
      image_id: 'image_id',
      image_url: 'image_url',
      ingredient_list: [
        'First ingredient',
        'Second ingredient',
        'Third ingredient',
      ],
      instruction_steps: ['First step', 'Second step', 'Third step'],
    };

    component.setEditedRecipe(recipe);

    fixture.detectChanges();

    const deleteButton = compiled.querySelectorAll('button')[1];

    deleteButton.click();

    fixture.detectChanges();

    let modal = compiled.querySelector('.modal');

    expect(modal?.classList.contains('is-active')).toBeTrue();

    const closeButton = compiled.querySelectorAll('button')[3];
    closeButton.click();
    fixture.detectChanges();

    modal = compiled.querySelector('.modal');
    expect(modal?.classList.contains('is-active')).toBeFalse();
  });

  it('should delete recipe ', fakeAsync(() => {
    spyOn(router, 'navigate');
    recipeServiceSpy.delete_recipe.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next();
        });
      })
    );

    const user = {
      username: 'test',
      email: 'test@test.com',
    };
    (authServiceSpy.user$ as BehaviorSubject<UserResponse | null>).next(user);

    const recipe: RecipeResponse = {
      url: 'http://testserver/recipes/1/',
      cooking_time: '50:00:00',
      preparation_time: '00:05:06',
      title: 'Recipe 1',
      created_by_username: 'test',
      difficulty: 'hard',
      dietary_preferences: ['Gluten free'],
      meal_types: ['Breakfast', 'Brunch'],
      image_id: 'image_id',
      image_url: 'image_url',
      ingredient_list: [
        'First ingredient',
        'Second ingredient',
        'Third ingredient',
      ],
      instruction_steps: ['First step', 'Second step', 'Third step'],
    };

    component.setEditedRecipe(recipe);

    fixture.detectChanges();

    const deleteButton = compiled.querySelectorAll('button')[1];

    deleteButton.click();

    fixture.detectChanges();

    let modal = compiled.querySelector('.modal');

    expect(modal?.classList.contains('is-active')).toBeTrue();

    const confirmDeleteBtn = compiled.querySelectorAll('button')[2];
    confirmDeleteBtn.click();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    loader = compiled.querySelector('.loader');
    expect(loader).toBeFalsy();

    expect(recipeServiceSpy.delete_recipe).toHaveBeenCalledOnceWith(recipe.url);

    expect(component.recipe).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
  }));
});
