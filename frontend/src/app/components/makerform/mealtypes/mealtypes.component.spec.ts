import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealtypesComponent } from './mealtypes.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('MealtypesComponent', () => {
  let component: MealtypesComponent;
  let fixture: ComponentFixture<MealtypesComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealtypesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render component with the correct form elements', () => {
    const mainLabel = compiled.querySelectorAll('label')[0];
    const breakfastLabel = compiled.querySelectorAll('label')[1];
    const brunchLabel = compiled.querySelectorAll('label')[2];
    const lunchLabel = compiled.querySelectorAll('label')[3];
    const dinnerLabel = compiled.querySelectorAll('label')[4];
    const breakfastInput = compiled.querySelector(
      "input[formControlName='breakfast']"
    );
    const brunchInput = compiled.querySelector(
      "input[formControlName='brunch']"
    );
    const lunchInput = compiled.querySelector("input[formControlName='lunch']");
    const dinnerInput = compiled.querySelector(
      "input[formControlName='dinner']"
    );

    expect(mainLabel?.textContent).toBe('Meal type');
    expect(breakfastLabel?.textContent?.trim()).toBe('Breakfast');
    expect(brunchLabel?.textContent?.trim()).toBe('Brunch');
    expect(lunchLabel?.textContent?.trim()).toBe('Lunch');
    expect(dinnerLabel?.textContent?.trim()).toBe('Dinner');
    expect(breakfastInput).toBeTruthy();
    expect(brunchInput).toBeTruthy();
    expect(lunchInput).toBeTruthy();
    expect(dinnerInput).toBeTruthy();
  });

  it('should update the form when checkboxes are checked', () => {
    const mockForm = new FormGroup({
      mealType: new FormGroup({
        breakfast: new FormControl(false),
        brunch: new FormControl(false),
        lunch: new FormControl(false),
        dinner: new FormControl(false),
      }),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();

    const breakfastInput = compiled.querySelector(
      "input[formControlName='breakfast']"
    ) as HTMLInputElement;
    const brunchInput = compiled.querySelector(
      "input[formControlName='brunch']"
    ) as HTMLInputElement;
    const lunchInput = compiled.querySelector(
      "input[formControlName='lunch']"
    ) as HTMLInputElement;
    const dinnerInput = compiled.querySelector(
      "input[formControlName='dinner']"
    ) as HTMLInputElement;

    breakfastInput.checked = true;
    brunchInput.checked = true;
    lunchInput.checked = true;
    dinnerInput.checked = true;
    breakfastInput.dispatchEvent(new Event('change'));
    brunchInput.dispatchEvent(new Event('change'));
    lunchInput.dispatchEvent(new Event('change'));
    dinnerInput.dispatchEvent(new Event('change'));

    expect(component.makerForm.get('mealType')?.value.breakfast).toBeTrue();
    expect(component.makerForm.get('mealType')?.value.brunch).toBeTrue();
    expect(component.makerForm.get('mealType')?.value.lunch).toBeTrue();
    expect(component.makerForm.get('mealType')?.value.dinner).toBeTrue();
  });
});
