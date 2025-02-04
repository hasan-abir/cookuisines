import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { Observable, timer } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { MealtypeListComponent } from './mealtype-list.component';

describe('MealtypeListComponent', () => {
  let component: MealtypeListComponent;
  let fixture: ComponentFixture<MealtypeListComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', [
      'get_mealtype',
    ]);

    await TestBed.configureTestingModule({
      imports: [MealtypeListComponent],
      providers: [{ provide: RecipeService, useValue: getMethodSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    recipeServiceSpy.get_mealtype.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            url: 'http://testserver/recipes/mealtype/1/',
            breakfast: false,
            brunch: false,
            lunch: false,
            dinner: false,
            recipe: 'http://testserver/recipes/1/',
          });
        });
      })
    );
    fixture = TestBed.createComponent(MealtypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled = fixture.nativeElement;
  });

  it('should fetch the mealtype and display the mealtype values if they are true', fakeAsync(() => {
    const mealtypeUrl = 'mealtype-url';
    component.url = mealtypeUrl;
    let breakfastTag = compiled.querySelectorAll('.tag')[0];
    let brunchTag = compiled.querySelectorAll('.tag')[1];
    let lunchTag = compiled.querySelectorAll('.tag')[2];
    let dinnerTag = compiled.querySelectorAll('.tag')[3];

    expect(breakfastTag).toBeFalsy();
    expect(brunchTag).toBeFalsy();
    expect(lunchTag).toBeFalsy();
    expect(dinnerTag).toBeFalsy();

    const breakfast = true;
    const brunch = true;
    const lunch = true;
    const dinner = true;

    recipeServiceSpy.get_mealtype.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next({
            url: 'http://testserver/recipes/mealtype/1/',
            breakfast,
            brunch,
            lunch,
            dinner,
            recipe: 'http://testserver/recipes/1/',
          });
        });
      })
    );

    component.fetchMealtype();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    expect(recipeServiceSpy.get_mealtype).toHaveBeenCalledWith(mealtypeUrl);

    breakfastTag = compiled.querySelectorAll('.tag')[0];
    brunchTag = compiled.querySelectorAll('.tag')[1];
    lunchTag = compiled.querySelectorAll('.tag')[2];
    dinnerTag = compiled.querySelectorAll('.tag')[3];

    expect(breakfastTag).toBeTruthy();
    expect(brunchTag).toBeTruthy();
    expect(lunchTag).toBeTruthy();
    expect(dinnerTag).toBeTruthy();
  }));
});
