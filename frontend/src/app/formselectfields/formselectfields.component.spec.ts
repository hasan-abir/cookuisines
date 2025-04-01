import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormselectfieldsComponent } from './formselectfields.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('FormselectfieldsComponent', () => {
  let component: FormselectfieldsComponent;
  let fixture: ComponentFixture<FormselectfieldsComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormselectfieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormselectfieldsComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component with the correct form elements', () => {
    const fgName = 'mealType';
    const mockForm = new FormGroup({
      [fgName]: new FormGroup({
        breakfast: new FormControl(false),
        brunch: new FormControl(false),
        lunch: new FormControl(false),
        dinner: new FormControl(false),
      }),
    });
    const fields = [
      { label: 'break fast', name: 'breakfast' },
      { name: 'brunch' },
      { name: 'lunch' },
      { name: 'dinner' },
    ];
    const label = 'Meal type';
    component.form = mockForm as any;
    component.fgName = fgName;
    component.fields = fields;
    component.label = label;
    fixture.detectChanges();

    const mainLabel = compiled.querySelectorAll('label')[0];
    const breakfastLabel = compiled.querySelectorAll('label')[1];
    const brunchLabel = compiled.querySelectorAll('label')[2];
    const lunchLabel = compiled.querySelectorAll('label')[3];
    const dinnerLabel = compiled.querySelectorAll('label')[4];
    const checkboxes = compiled.querySelectorAll("[type='checkbox']");
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

    expect(mainLabel?.textContent).toBe(label);
    expect(breakfastLabel?.textContent?.trim()).toBe('break fast');
    expect(brunchLabel?.textContent?.trim()).toBe('brunch');
    expect(lunchLabel?.textContent?.trim()).toBe('lunch');
    expect(dinnerLabel?.textContent?.trim()).toBe('dinner');
    expect(checkboxes[0].getAttribute('ng-reflect-name')).toBe('breakfast');
    expect(checkboxes[1].getAttribute('ng-reflect-name')).toBe('brunch');
    expect(checkboxes[2].getAttribute('ng-reflect-name')).toBe('lunch');
    expect(checkboxes[3].getAttribute('ng-reflect-name')).toBe('dinner');
  });

  it('should update the form when checkboxes are checked', () => {
    const fgName = 'mealType';
    const mockForm = new FormGroup({
      [fgName]: new FormGroup({
        breakfast: new FormControl(false),
        brunch: new FormControl(false),
        lunch: new FormControl(false),
        dinner: new FormControl(false),
      }),
    });
    const fields = [
      { name: 'breakfast' },
      { name: 'brunch' },
      { name: 'lunch' },
      { name: 'dinner' },
    ];
    component.form = mockForm as any;
    component.fgName = fgName;
    component.fields = fields;
    fixture.detectChanges();

    const breakfastInput = compiled.querySelector(
      "input[ng-reflect-name='breakfast']"
    ) as HTMLInputElement;
    const brunchInput = compiled.querySelector(
      "input[ng-reflect-name='brunch']"
    ) as HTMLInputElement;
    const lunchInput = compiled.querySelector(
      "input[ng-reflect-name='lunch']"
    ) as HTMLInputElement;
    const dinnerInput = compiled.querySelector(
      "input[ng-reflect-name='dinner']"
    ) as HTMLInputElement;

    breakfastInput.checked = true;
    brunchInput.checked = true;
    lunchInput.checked = true;
    dinnerInput.checked = true;
    breakfastInput.dispatchEvent(new Event('change'));
    brunchInput.dispatchEvent(new Event('change'));
    lunchInput.dispatchEvent(new Event('change'));
    dinnerInput.dispatchEvent(new Event('change'));

    expect(component.form.get('mealType')?.value.breakfast).toBeTrue();
    expect(component.form.get('mealType')?.value.brunch).toBeTrue();
    expect(component.form.get('mealType')?.value.lunch).toBeTrue();
    expect(component.form.get('mealType')?.value.dinner).toBeTrue();
  });
});
