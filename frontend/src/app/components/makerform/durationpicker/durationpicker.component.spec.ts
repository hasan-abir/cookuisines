import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup } from '@angular/forms';
import { DurationpickerComponent } from './durationpicker.component';

describe('DurationpickerComponent', () => {
  let component: DurationpickerComponent;
  let fixture: ComponentFixture<DurationpickerComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DurationpickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DurationpickerComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    const mockForm = new FormGroup({
      preparationTime: new FormGroup({
        hours: new FormControl(0),
        minutes: new FormControl(0),
        seconds: new FormControl(0),
      }),
    });
    component.fgName = 'preparationTime';
    component.makerForm = mockForm as any;
    fixture.detectChanges();
  });

  it('should render component with the correct form elements', () => {
    const hoursLabel = compiled.querySelector(
      "label[for='preparationTime-hours']"
    );
    const minutesLabel = compiled.querySelector(
      "label[for='preparationTime-minutes']"
    );
    const secondsLabel = compiled.querySelector(
      "label[for='preparationTime-seconds']"
    );

    const hoursInput = compiled.querySelector("input[formControlName='hours']");
    const minutesInput = compiled.querySelector(
      "input[formControlName='minutes']"
    );
    const secondsInput = compiled.querySelector(
      "input[formControlName='seconds']"
    );

    expect(hoursLabel).toBeTruthy();
    expect(minutesLabel).toBeTruthy();
    expect(secondsLabel).toBeTruthy();
    expect(hoursInput).toBeTruthy();
    expect(minutesInput).toBeTruthy();
    expect(secondsInput).toBeTruthy();
  });

  it('should display initial form values correctly', () => {
    const hoursInput = compiled.querySelector(
      "input[formControlName='hours']"
    ) as HTMLInputElement;
    const minutesInput = compiled.querySelector(
      "input[formControlName='minutes']"
    ) as HTMLInputElement;
    const secondsInput = compiled.querySelector(
      "input[formControlName='seconds']"
    ) as HTMLInputElement;

    expect(hoursInput.value).toBe('0');
    expect(minutesInput.value).toBe('0');
    expect(secondsInput.value).toBe('0');
  });

  it('should update the form when input texts are changed', () => {
    const hoursInput = compiled.querySelector(
      "input[formControlName='hours']"
    ) as HTMLInputElement;
    const minutesInput = compiled.querySelector(
      "input[formControlName='minutes']"
    ) as HTMLInputElement;
    const secondsInput = compiled.querySelector(
      "input[formControlName='seconds']"
    ) as HTMLInputElement;

    hoursInput.value = '3';
    minutesInput.value = '2';
    secondsInput.value = '1';
    hoursInput.dispatchEvent(new Event('input'));
    minutesInput.dispatchEvent(new Event('input'));
    secondsInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(hoursInput.value).toBe('3');
    expect(component.makerForm.get('preparationTime.hours')?.value).toBe(3);
    expect(component.makerForm.get('preparationTime.minutes')?.value).toBe(2);
    expect(component.makerForm.get('preparationTime.seconds')?.value).toBe(1);
  });
});
