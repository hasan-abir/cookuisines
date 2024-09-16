import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup } from '@angular/forms';
import { DietarypreferencesComponent } from './dietarypreferences.component';

describe('DietarypreferencesComponent', () => {
  let component: DietarypreferencesComponent;
  let fixture: ComponentFixture<DietarypreferencesComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietarypreferencesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DietarypreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render component with the correct form elements', () => {
    const label = compiled.querySelector('label');
    const veganInput = compiled.querySelector("input[formControlName='vegan']");
    const glutenfreeInput = compiled.querySelector(
      "input[formControlName='glutenfree']"
    );

    expect(label?.textContent).toBe('Dietary preference');
    expect(veganInput).toBeTruthy();
    expect(glutenfreeInput).toBeTruthy();
  });

  it('should display initial form values correctly', () => {
    const mockForm = new FormGroup({
      dietaryPreference: new FormGroup({
        vegan: new FormControl(true),
        glutenfree: new FormControl(false),
      }),
    });

    component.makerForm = mockForm as any;

    fixture.detectChanges();

    const veganInput = compiled.querySelector(
      "input[formControlName='vegan']"
    ) as HTMLInputElement;
    const glutenfreeInput = compiled.querySelector(
      "input[formControlName='glutenfree']"
    ) as HTMLInputElement;

    expect(veganInput.checked).toBeTrue();
    expect(glutenfreeInput.checked).toBeFalse();
  });

  it('should update the form when checkboxes are clicked', () => {
    const mockForm = new FormGroup({
      dietaryPreference: new FormGroup({
        vegan: new FormControl(false),
        glutenfree: new FormControl(false),
      }),
    });

    component.makerForm = mockForm as any;

    fixture.detectChanges();

    const veganInput = compiled.querySelector(
      "input[formControlName='vegan']"
    ) as HTMLInputElement;
    const glutenfreeInput = compiled.querySelector(
      "input[formControlName='glutenfree']"
    ) as HTMLInputElement;

    veganInput.click();
    fixture.detectChanges();
    expect(
      component.makerForm.get('dietaryPreference.vegan')?.value
    ).toBeTrue();

    glutenfreeInput.click();
    fixture.detectChanges();
    expect(
      component.makerForm.get('dietaryPreference.glutenfree')?.value
    ).toBeTrue();
  });
});
