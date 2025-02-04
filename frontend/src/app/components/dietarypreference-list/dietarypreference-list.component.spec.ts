import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { DietarypreferenceListComponent } from './dietarypreference-list.component';
import { RecipeService } from '../../services/recipe.service';
import { Observable, timer } from 'rxjs';

describe('DietarypreferenceListComponent', () => {
  let component: DietarypreferenceListComponent;
  let fixture: ComponentFixture<DietarypreferenceListComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', [
      'get_dietarypreference',
    ]);

    await TestBed.configureTestingModule({
      imports: [DietarypreferenceListComponent],
      providers: [{ provide: RecipeService, useValue: getMethodSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    recipeServiceSpy.get_dietarypreference.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            url: 'http://testserver/recipes/dietarypreference/1/',
            vegan: false,
            glutenfree: false,
            recipe: 'http://testserver/recipes/1/',
          });
        });
      })
    );
    fixture = TestBed.createComponent(DietarypreferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled = fixture.nativeElement;
  });

  it('should fetch the dietarypreference and display the dietarypreference values if they are true', fakeAsync(() => {
    const dietarypreferenceUrl = 'dietarypreference-url';
    component.url = dietarypreferenceUrl;

    let veganTag = compiled.querySelectorAll('.tag')[0];
    let glutenfreeTag = compiled.querySelectorAll('.tag')[1];

    expect(veganTag).toBeFalsy();
    expect(glutenfreeTag).toBeFalsy();

    const vegan = true;
    const glutenfree = true;

    recipeServiceSpy.get_dietarypreference.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            url: 'http://testserver/recipes/dietarypreferences/1/',
            vegan,
            glutenfree,
            recipe: 'http://testserver/recipes/1/',
          });
        });
      })
    );

    component.fetchDietarypreference();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    expect(recipeServiceSpy.get_dietarypreference).toHaveBeenCalledWith(
      dietarypreferenceUrl
    );

    veganTag = compiled.querySelectorAll('.tag')[0];
    glutenfreeTag = compiled.querySelectorAll('.tag')[1];

    expect(veganTag).toBeTruthy();
    expect(glutenfreeTag).toBeTruthy();
  }));
});
