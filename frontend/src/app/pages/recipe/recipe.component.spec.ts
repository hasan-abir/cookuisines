import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { routes } from '../../app.routes';
import { MealtypeListComponent } from '../../components/mealtype-list/mealtype-list.component';
import { RecipeResponse, RecipeService } from '../../services/recipe.service';
import { RecipeComponent } from './recipe.component';
import { DietarypreferenceListComponent } from '../../components/dietarypreference-list/dietarypreference-list.component';
import { IngredientListComponent } from '../../components/ingredient-list/ingredient-list.component';
import { InstructionListComponent } from '../../components/instruction-list/instruction-list.component';

@Component({
  selector: 'app-mealtype-list',
  template: '',
  standalone: true,
})
class MockMealtypeListComponent {
  @Input() url = '';
}

@Component({
  selector: 'app-dietarypreference-list',
  template: '',
  standalone: true,
})
class MockDietarypreferenceListComponent {
  @Input() url = '';
}

@Component({
  selector: 'app-ingredient-list',
  template: '',
  standalone: true,
})
class MockIngredientListComponent {
  @Input() url = '';
}

@Component({
  selector: 'app-instruction-list',
  template: '',
  standalone: true,
})
class MockInstructionListComponent {
  @Input() url = '';
}

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', ['get_recipe']);

    await TestBed.configureTestingModule({
      imports: [RecipeComponent],
      providers: [
        provideRouter(routes),
        { provide: RecipeService, useValue: getMethodSpy },
      ],
    })
      .overrideComponent(RecipeComponent, {
        remove: {
          imports: [
            MealtypeListComponent,
            DietarypreferenceListComponent,
            IngredientListComponent,
            InstructionListComponent,
          ],
        },
        add: {
          imports: [
            MockMealtypeListComponent,
            MockDietarypreferenceListComponent,
            MockIngredientListComponent,
            MockInstructionListComponent,
          ],
        },
      })
      .compileComponents();

    route = TestBed.inject(ActivatedRoute);
    route.snapshot.params = { id: '1' };
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
            dietary_preference: 'dietarypreference_url',
            meal_type: 'mealtype_url',
            image_id: 'image_id',
            image_url: 'image_url',
            ingredients: 'ingredients_url',
            instructions: 'instructions_url',
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
      dietary_preference: 'dietarypreference_url',
      meal_type: 'mealtype_url',
      image_id: 'image_id',
      image_url: 'image_url',
      ingredients: 'ingredients_url',
      instructions: 'instructions_url',
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

    expect(recipeServiceSpy.get_recipe).toHaveBeenCalledWith('1');

    titleHeading = compiled.querySelectorAll('h1')[0];
    const paragraphs = compiled.querySelectorAll('p');

    expect(paragraphs[0].textContent?.trim()).toBe('5 minutes, 6 seconds');
    expect(paragraphs[1].textContent?.trim()).toBe('50 hours');
    expect(paragraphs[2].textContent?.trim()).toBe(recipe.difficulty);
  }));
});
