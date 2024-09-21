import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipemakerComponent } from './recipemaker.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('RecipemakerComponent', () => {
  let component: RecipemakerComponent;
  let fixture: ComponentFixture<RecipemakerComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipemakerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipemakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
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

  it('should reset the form after changes', () => {
    component.makerForm.setValue({
      title: 'Yo dot',
      cookingTime: { hours: 0, minutes: 1, seconds: 0 },
      preparationTime: { hours: 0, minutes: 1, seconds: 0 },
      dietaryPreference: { glutenfree: false, vegan: true },
      difficulty: 'hard',
      image: null,
      ingredients: [],
      instructions: [],
      mealType: {
        breakfast: true,
        brunch: false,
        lunch: false,
        dinner: false,
      },
    });
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

    expect(component.makerForm.get('title')?.value).toBe(null);
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
  });
  it('should display title err', () => {
    const errEl = compiled.querySelector('.help');

    expect(errEl?.textContent?.trim()).toBe(
      'You might not bother with it, but a proper title is a must'
    );
  });
});
