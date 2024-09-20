import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsformarrayComponent } from './ingredientsformarray.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('IngredientsformarrayComponent', () => {
  let component: IngredientsformarrayComponent;
  let fixture: ComponentFixture<IngredientsformarrayComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsformarrayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsformarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render component with the correct form elements', () => {
    const firstLabel = compiled.querySelectorAll('label')[0];
    const addButton = compiled.querySelector('button.is-primary');

    expect(firstLabel?.textContent).toBe('Add ingredient*');
    expect(addButton).toBeTruthy();
  });

  it('should reveal more form elements when clicked the add button and should remove them all when clicked the remove button', () => {
    const mockForm = new FormGroup({
      ingredients: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const nameLabel = compiled.querySelectorAll('label')[1];
    const nameInput = compiled.querySelector('#ingredient-name-0');
    const quantityLabel = compiled.querySelectorAll('label')[2];
    const quantityInput = compiled.querySelector('#ingredient-quantity-0');
    const removeButton = compiled.querySelector(
      'button.is-danger'
    ) as HTMLButtonElement;

    expect(component.ingredients.length > 0).toBeTrue();
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

  it('should update the ingredients form on input change', () => {
    const mockForm = new FormGroup({
      ingredients: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    const addButton = compiled.querySelector(
      'button.is-primary'
    ) as HTMLButtonElement;

    addButton.click();
    fixture.detectChanges();

    const nameInput = compiled.querySelector(
      '#ingredient-name-0'
    ) as HTMLInputElement;
    const quantityInput = compiled.querySelector(
      '#ingredient-quantity-0'
    ) as HTMLInputElement;

    const nameVal = 'Love Shack';
    const quantityVal = 'Little old place';

    nameInput.value = nameVal;
    quantityInput.value = quantityVal;
    nameInput.dispatchEvent(new Event('input'));
    quantityInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.ingredients.at(0).value['name']).toBe(nameVal);
    expect(component.ingredients.at(0).value['quantity']).toBe(quantityVal);
  });

  it('should display the errors', () => {
    const mockForm = new FormGroup({
      ingredients: new FormArray<FormControl<unknown>>([]),
    });
    component.makerForm = mockForm as any;
    fixture.detectChanges();
    component.ingredients.setErrors({ required: true });
    fixture.detectChanges();

    const errEl = compiled.querySelector('.help');

    expect(errEl).toBeTruthy();
    expect(errEl?.textContent?.trim()).toBe(
      'Ingredients are what makes the meal; you have to provide them'
    );
  });
});
