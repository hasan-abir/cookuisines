import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type MakerForm = FormGroup<{
  title: FormControl<string | null>;
  ingredients: FormArray<FormControl<unknown>>;
  instructions: FormArray<FormControl<unknown>>;
  preparationTime: FormGroup<{
    hours: FormControl<number | null>;
    minutes: FormControl<number | null>;
    seconds: FormControl<number | null>;
  }>;
  cookingTime: FormGroup<{
    hours: FormControl<number | null>;
    minutes: FormControl<number | null>;
    seconds: FormControl<number | null>;
  }>;
  difficulty: FormControl<string | null>;
  image: FormControl<File | null>;
  mealType: FormGroup<{
    breakfast: FormControl<boolean | null>;
    brunch: FormControl<boolean | null>;
    lunch: FormControl<boolean | null>;
    dinner: FormControl<boolean | null>;
  }>;
  dietaryPreference: FormGroup<{
    vegan: FormControl<boolean | null>;
    glutenfree: FormControl<boolean | null>;
  }>;
}>;
