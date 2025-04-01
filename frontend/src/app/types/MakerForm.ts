import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IngredientBody,
  IngredientResponse,
  InstructionBody,
  InstructionResponse,
} from '../services/recipe.service';

export type MakerForm = FormGroup<{
  title: FormControl<string>;
  ingredients: FormArray<FormControl<unknown>>;
  instructions: FormArray<FormControl<unknown>>;
  preparationTime: FormGroup<{
    hours: FormControl<number>;
    minutes: FormControl<number>;
    seconds: FormControl<number>;
  }>;
  cookingTime: FormGroup<{
    hours: FormControl<number>;
    minutes: FormControl<number>;
    seconds: FormControl<number>;
  }>;
  difficulty: FormControl<string>;
  image: FormControl<File | null>;
  mealType: FormGroup<{
    breakfast: FormControl<boolean>;
    brunch: FormControl<boolean>;
    lunch: FormControl<boolean>;
    dinner: FormControl<boolean>;
  }>;
  dietaryPreference: FormGroup<{
    vegan: FormControl<boolean>;
    glutenfree: FormControl<boolean>;
  }>;
}>;

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface MakerFormVal {
  title: string;
  ingredients: IngredientBody[];
  instructions: InstructionBody[];
  preparationTime: Duration;
  cookingTime: Duration;
  difficulty: 'easy' | 'medium' | 'hard';
  image: File;
  mealType: {
    breakfast: boolean;
    brunch: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  dietaryPreference: {
    vegan: boolean;
    glutenfree: boolean;
  };
}
