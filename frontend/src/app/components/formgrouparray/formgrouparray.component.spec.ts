import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormgrouparrayComponent } from './formgrouparray.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('FormgrouparrayComponent', () => {
  let component: FormgrouparrayComponent;
  let fixture: ComponentFixture<FormgrouparrayComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormgrouparrayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormgrouparrayComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component with the correct form elements', () => {
    const formArrName = 'ingredients';
    const formControls = {
      [formArrName]: new FormArray<FormControl<unknown>>([]),
    };
    const mockForm = new FormGroup(formControls);
    component.form = mockForm as any;
    component.formArrName = formArrName;

    fixture.detectChanges();

    const firstLabel = compiled.querySelectorAll('label')[0];
    const addButton = compiled.querySelector('button.is-primary');

    expect(firstLabel?.textContent).toBe(`Add ${formArrName}*`);
    expect(addButton).toBeTruthy();
  });

  it('should reveal more form elements when clicked the add button and should remove them all when clicked the remove button', () => {
    const formArrName = 'ingredients';
    const mockForm = new FormGroup({
      [formArrName]: new FormArray<FormControl<unknown>>([]),
    });
    component.form = mockForm as any;
    component.formArrName = formArrName;
    component.fields = [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Quantity', name: 'quantity', type: 'text' },
    ];
    fixture.detectChanges();
    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const nameLabel = compiled.querySelectorAll('label')[1];
    const nameInput = compiled.querySelector('#ingredients-name-0');
    const quantityLabel = compiled.querySelectorAll('label')[2];
    const quantityInput = compiled.querySelector('#ingredients-quantity-0');
    const removeButton = compiled.querySelector(
      'button.is-danger'
    ) as HTMLButtonElement;

    expect(component.items.length > 0).toBeTrue();
    expect(nameLabel).toBeTruthy();
    expect(nameInput).toBeTruthy();
    expect(quantityLabel).toBeTruthy();
    expect(quantityInput).toBeTruthy();
    expect(removeButton).toBeTruthy();

    removeButton.click();
    fixture.detectChanges();

    const nameLabelUpdated = compiled.querySelectorAll('label')[1];
    const nameInputUpdated = compiled.querySelector('#ingredient-name-0');
    const quantityLabelUpdated = compiled.querySelectorAll('label')[2];
    const quantityInputUpdated = compiled.querySelector(
      '#ingredient-quantity-0'
    );
    const removeButtonUpdated = compiled.querySelector('button.is-danger');
    expect(nameLabelUpdated).toBeFalsy();
    expect(nameInputUpdated).toBeFalsy();
    expect(quantityLabelUpdated).toBeFalsy();
    expect(quantityInputUpdated).toBeFalsy();
    expect(removeButtonUpdated).toBeFalsy();
  });

  it('should update the items form on input change', () => {
    const formArrName = 'ingredients';
    const mockForm = new FormGroup({
      [formArrName]: new FormArray<FormControl<unknown>>([]),
    });
    component.form = mockForm as any;
    component.formArrName = formArrName;
    component.fields = [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Quantity', name: 'quantity', type: 'text' },
    ];
    fixture.detectChanges();

    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const nameInput = compiled.querySelector(
      '#ingredients-name-0'
    ) as HTMLInputElement;
    const quantityInput = compiled.querySelector(
      '#ingredients-quantity-0'
    ) as HTMLInputElement;

    const nameVal = 'Love Shack';
    const quantityVal = 'Little old place';

    nameInput.value = nameVal;
    quantityInput.value = quantityVal;
    nameInput.dispatchEvent(new Event('input'));
    quantityInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.items.at(0).value['name']).toBe(nameVal);
    expect(component.items.at(0).value['quantity']).toBe(quantityVal);
  });

  it('should display the errors', () => {
    const requiredMsg = 'This field is required';
    const formArrName = 'ingredients';
    const mockForm = new FormGroup({
      [formArrName]: new FormArray<FormControl<unknown>>([]),
    });
    component.form = mockForm as any;
    component.formArrName = formArrName;
    component.requiredMsg = requiredMsg;
    component.fields = [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Quantity', name: 'quantity', type: 'text' },
    ];
    fixture.detectChanges();

    component.items.setErrors({ required: true });
    fixture.detectChanges();

    const errEl = compiled.querySelector('.help');

    expect(errEl).toBeTruthy();
    expect(errEl?.textContent?.trim()).toBe(requiredMsg);
  });
});
