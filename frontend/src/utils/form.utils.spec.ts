import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  createBooleanGroup,
  createFormControl,
  durationGroup,
  numberValidator,
  populateFormArray,
  shortenObj,
} from './form.utils';
import { checkDurationGreaterThanZero } from '../app/components/durationpicker/durationpicker.component';

describe('Form utils', () => {
  beforeEach(() => {});

  it('should create form control', () => {
    const val = 'test';
    const control = createFormControl(val);

    expect(control.value).toBe(val);
  });
  it('should create boolean group', () => {
    const fields = ['test', 'test2'];
    const group = createBooleanGroup(fields);

    expect(group.value['test']).toBeFalse();
    expect(group.value['test2']).toBeFalse();
  });
  it('should create number validators', () => {
    const min = 5;
    const max = 10;
    const control = createFormControl(5, numberValidator(min, max));

    expect(control.valid).toBeTrue();
    expect(control.errors).toBeFalsy();

    control.setValue(3);
    expect(control.valid).toBeFalse();
    expect(control.errors).toEqual({ min: { min, actual: 3 } });

    control.setValue(11);
    expect(control.valid).toBeFalse();
    expect(control.errors).toEqual({ max: { max, actual: 11 } });

    control.setValue(7);
    expect(control.valid).toBeTrue();
  });

  it('should create duration group', () => {
    const formGroup = durationGroup(new FormBuilder());

    expect(formGroup).toBeInstanceOf(FormGroup);
    expect(formGroup.value).toEqual({ hours: 0, minutes: 0, seconds: 0 });

    ['hours', 'minutes', 'seconds'].forEach((field) => {
      const control = formGroup.get(field);
      expect(control).toBeDefined();
      expect(control?.validator).toBeDefined();
    });
  });
  it('should shorten obj', () => {
    const obj = {
      test: 'test',
      test2: 'test2',
      test3: 'test3',
    };

    const shortenedObj = shortenObj(obj, ['test', 'test2']);

    expect(Object.keys(shortenedObj).length).toBe(2);
    expect(shortenedObj['test']).toBe('test');
    expect(shortenedObj['test2']).toBe('test2');
  });

  it('should populate form array', () => {
    const formBuilder = new FormBuilder();
    const formArray = new FormArray([] as FormGroup[]);

    const data = [
      { name: 'Alice', age: 25, city: 'New York' },
      { name: 'Bob', age: 30, city: 'Los Angeles' },
    ];
    const fields: (keyof (typeof data)[0])[] = ['name', 'age'];

    populateFormArray(formBuilder, formArray, data, fields);

    expect(formArray.length).toBe(2);

    formArray.controls.forEach((group, index) => {
      expect(group).toBeInstanceOf(FormGroup);
      expect(group.value).toEqual({
        name: data[index].name,
        age: data[index].age,
      });
      expect(group.get('city')).toBeNull();
    });
  });
});
