import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { checkDurationGreaterThanZero } from '../app/components/durationpicker/durationpicker.component';

export const createFormControl = <T>(val: T, validators?: any[]) => {
  return new FormControl<T>(val, validators) as FormControl<T>;
};

export const createBooleanGroup = <T extends string>(
  fields: readonly T[]
): FormGroup<Record<T, FormControl<boolean>>> => {
  const controls: Record<T, FormControl<boolean>> = fields.reduce(
    (acc, field) => {
      acc[field] = createFormControl<boolean>(false);
      return acc;
    },
    {} as Record<T, FormControl<boolean>>
  );
  return new FormGroup<Record<T, FormControl<boolean>>>(controls);
};

export const numberValidator = (min: number, max: number) => {
  return [Validators.required, Validators.min(min), Validators.max(max)];
};

export const durationGroup = (formBuilder: FormBuilder, validate = true) => {
  const validators = [];

  if (validate) validators.push(checkDurationGreaterThanZero());

  return formBuilder.group(
    {
      hours: createFormControl<number>(0, numberValidator(0, 23)),
      minutes: createFormControl<number>(0, numberValidator(0, 59)),
      seconds: createFormControl<number>(0, numberValidator(0, 59)),
    },
    {
      validators,
    }
  );
};

export const shortenObj = <T extends object>(
  obj: T,
  fields: (keyof T)[],
  isFormControl?: boolean
) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => fields.includes(k as keyof T))
      .map(([k, v]) => {
        return isFormControl ? [k, [v, Validators.required]] : [k, v];
      })
  );
};

export const populateFormArray = <T extends object>(
  formBuilder: FormBuilder,
  formArr: FormArray<FormGroup>,
  arr: T[],
  fields: (keyof T)[]
) => {
  arr.forEach((val) => {
    const control = shortenObj(val, fields, true);

    formArr.push(formBuilder.group(control));
  });
};

export const compareTwoObjsExistingKeys = <T extends object, U extends object>(
  obj1: T,
  obj2: U
): Partial<U> => {
  const commonKeys = Object.keys(obj1).filter((key) => key in obj2) as Array<
    keyof T & keyof U
  >;

  const extraKeysInObj2 = Object.keys(obj2).filter(
    (key) => !(key in obj1)
  ) as Array<keyof U>;

  const result: Partial<U> = commonKeys.reduce((acc, key) => {
    const equalVal = (obj1[key] as unknown) === (obj2[key] as unknown);

    const equalArrays =
      Array.isArray(obj1[key]) &&
      Array.isArray(obj2[key]) &&
      (obj1[key] as Array<string>).join() ===
        (obj2[key] as Array<string>).join();

    if (!equalVal && !equalArrays) {
      acc[key] = obj2[key];
    }
    return acc;
  }, {} as Partial<U>);

  extraKeysInObj2.forEach((key) => {
    result[key] = obj2[key];
  });

  return result;
};
