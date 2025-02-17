import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { InstructionListComponent } from './instruction-list.component';
import { RecipeService } from '../../services/recipe.service';
import { Observable, timer } from 'rxjs';
import { ComponentFactoryResolver } from '@angular/core';

describe('InstructionListComponent', () => {
  let component: InstructionListComponent;
  let fixture: ComponentFixture<InstructionListComponent>;
  let compiled: HTMLElement;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    const getMethodSpy = jasmine.createSpyObj('RecipeService', [
      'get_instructions',
    ]);

    await TestBed.configureTestingModule({
      imports: [InstructionListComponent],
      providers: [{ provide: RecipeService, useValue: getMethodSpy }],
    }).compileComponents();

    recipeServiceSpy = TestBed.inject(
      RecipeService
    ) as jasmine.SpyObj<RecipeService>;
    recipeServiceSpy.get_instructions.and.returnValue(
      new Observable((subscriber) => {
        subscriber.next({
          count: 0,
          previous: null,
          next: null,
          results: [],
        });
      })
    );
    fixture = TestBed.createComponent(InstructionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    compiled = fixture.nativeElement;
  });

  it('should fetch the instructions and display the instructions array', fakeAsync(() => {
    spyOn(component.setInstructions, 'emit');

    const instructionsUrl = 'instructions-url';
    component.url = instructionsUrl;

    let instructionsLi = compiled.querySelectorAll('li');

    expect(instructionsLi.length).toBe(0);

    const steps = ['Step 1', 'Step 2'];

    const instructionsMockResponse = {
      count: 0,
      previous: null,
      next: null,
      results: [
        {
          url: 'http://testserver/recipes/instructions/1/',
          step: steps[0],
        },
        {
          url: 'http://testserver/recipes/instructions/2/',
          step: steps[1],
        },
      ],
    };

    recipeServiceSpy.get_instructions.and.returnValue(
      new Observable((subscriber) => {
        timer(2000).subscribe(() => {
          subscriber.next(instructionsMockResponse);
        });
      })
    );

    component.fetchInstructions();
    fixture.detectChanges();

    let loader = compiled.querySelector('.loader');
    expect(loader).toBeTruthy();

    tick(2000);
    fixture.detectChanges();

    expect(recipeServiceSpy.get_instructions).toHaveBeenCalledWith(
      instructionsUrl
    );
    expect(component.setInstructions.emit).toHaveBeenCalledWith(
      component.paginatedInstructions.results
    );

    instructionsLi = compiled.querySelectorAll('li');

    expect(instructionsLi.length).toBe(2);
    expect(instructionsLi[0].textContent?.trim()).toBe(steps[0]);
    expect(instructionsLi[1].textContent?.trim()).toBe(steps[1]);
  }));

  it('should fetch more instructions', fakeAsync(() => {
    spyOn(component.setInstructions, 'emit');

    const nextPage = 'http://testserver/instructions/?page=2';
    const steps = ['Step 1', 'Step 2'];
    recipeServiceSpy.get_instructions.and.returnValues(
      new Observable((subscriber) => {
        subscriber.next({
          count: 2,
          next: nextPage,
          previous: null,
          results: [
            {
              url: 'http://testserver/recipes/instructions/1/',
              step: steps[0],
            },
            {
              url: 'http://testserver/recipes/instructions/2/',
              step: steps[1],
            },
          ],
        });
      }),
      new Observable((subscriber) => {
        subscriber.next({
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              url: 'http://testserver/recipes/instructions/1/',
              step: steps[0],
            },
            {
              url: 'http://testserver/recipes/instructions/2/',
              step: steps[1],
            },
          ],
        });
      })
    );

    component.fetchInstructions();
    fixture.detectChanges();

    const instructionsLi = compiled.querySelectorAll('li');
    expect(recipeServiceSpy.get_instructions).toHaveBeenCalledTimes(3);
    expect(recipeServiceSpy.get_instructions).toHaveBeenCalledWith('');
    expect(recipeServiceSpy.get_instructions).toHaveBeenCalledWith(nextPage);
    expect(instructionsLi.length).toBe(4);
    expect(component.setInstructions.emit).toHaveBeenCalledTimes(1);
    expect(component.setInstructions.emit).toHaveBeenCalledWith([
      {
        url: 'http://testserver/recipes/instructions/1/',
        step: steps[0],
      },
      {
        url: 'http://testserver/recipes/instructions/2/',
        step: steps[1],
      },
      {
        url: 'http://testserver/recipes/instructions/1/',
        step: steps[0],
      },
      {
        url: 'http://testserver/recipes/instructions/2/',
        step: steps[1],
      },
    ]);
  }));
});
