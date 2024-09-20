import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsformarrayComponent } from './instructionsformarray.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('InstructionsformarrayComponent', () => {
  let component: InstructionsformarrayComponent;
  let fixture: ComponentFixture<InstructionsformarrayComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsformarrayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsformarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render component with the correct form elements', () => {
    const firstLabel = compiled.querySelectorAll('label')[0];
    const addButton = compiled.querySelector('button.is-primary');

    expect(firstLabel?.textContent).toBe('Add Instruction*');
    expect(addButton).toBeTruthy();
  });

  it('should reveal more form elements when clicked the add button and should remove them all when clicked the remove button', () => {
    const mockForm = new FormGroup({
      instructions: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const stepLabel = compiled.querySelectorAll('label')[1];
    const stepInput = compiled.querySelector('#instruction-step-0');
    const removeButton = compiled.querySelector(
      'button.is-danger'
    ) as HTMLButtonElement;

    expect(component.instructions.length > 0).toBeTrue();
    expect(stepLabel).toBeTruthy();
    expect(stepInput).toBeTruthy();
    expect(removeButton).toBeTruthy();

    removeButton.click();
    fixture.detectChanges();

    const stepLabelUpdated = compiled.querySelectorAll('label')[1];
    const stepInputUpdated = compiled.querySelector('#instruction-step-0');
    const removeButtonUpdated = compiled.querySelector('button.is-danger');
    expect(stepLabelUpdated).toBeFalsy();
    expect(stepInputUpdated).toBeFalsy();
    expect(removeButtonUpdated).toBeFalsy();
  });

  it('should update the instructions form on input change', () => {
    const mockForm = new FormGroup({
      instructions: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const stepInput = compiled.querySelector(
      '#instruction-step-0'
    ) as HTMLInputElement;

    const stepVal = 'Love Shack';

    stepInput.value = stepVal;
    stepInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.instructions.at(0).value['step']).toBe(stepVal);
  });

  it('should display the errors', () => {
    const mockForm = new FormGroup({
      instructions: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    component.instructions.setErrors({ required: true });
    fixture.detectChanges();

    const errEl = compiled.querySelector('.help');

    expect(errEl).toBeTruthy();
    expect(errEl?.textContent?.trim()).toBe(
      'How do you actually make it? Please tell us the steps'
    );
  });
});
