import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  checkDurationGreaterThanZero,
  DurationpickerComponent,
} from '../../components/makerform/durationpicker/durationpicker.component';
import {
  FileuploadComponent,
  validateImageFile,
} from '../../components/makerform/fileupload/fileupload.component';
import { IngredientsformarrayComponent } from '../../components/makerform/ingredientsformarray/ingredientsformarray.component';
import { InstructionsformarrayComponent } from '../../components/makerform/instructionsformarray/instructionsformarray.component';
import { MakerForm } from '../../types/MakerForm';
import {
  checkAMealTypeExists,
  MealtypesComponent,
} from '../../components/makerform/mealtypes/mealtypes.component';
import { DietarypreferencesComponent } from '../../components/makerform/dietarypreferences/dietarypreferences.component';

export const initialMakerForm: MakerForm = new FormGroup({
  title: new FormControl(''),
  ingredients: new FormArray<FormControl<unknown>>([]),
  instructions: new FormArray<FormControl<unknown>>([]),
  preparationTime: new FormGroup({
    hours: new FormControl(0),
    minutes: new FormControl(0),
    seconds: new FormControl(0),
  }),
  cookingTime: new FormGroup({
    hours: new FormControl(0),
    minutes: new FormControl(0),
    seconds: new FormControl(0),
  }),
  difficulty: new FormControl(''),
  image: new FormControl<File | null>(null),
  mealType: new FormGroup({
    breakfast: new FormControl(false),
    brunch: new FormControl(false),
    lunch: new FormControl(false),
    dinner: new FormControl(false),
  }),
  dietaryPreference: new FormGroup({
    vegan: new FormControl(false),
    glutenfree: new FormControl(false),
  }),
});

@Component({
  selector: 'app-recipemaker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IngredientsformarrayComponent,
    InstructionsformarrayComponent,
    DurationpickerComponent,
    FileuploadComponent,
    MealtypesComponent,
    DietarypreferencesComponent,
  ],
  templateUrl: './recipemaker.component.html',
  styleUrl: './recipemaker.component.css',
})
export class RecipemakerComponent {
  difficulties = ['easy', 'medium', 'hard'];

  makerForm = this.formBuilder.group({
    title: new FormControl<string | null>(null, Validators.required),
    ingredients: this.formBuilder.array<FormControl<unknown>>(
      [],
      Validators.required
    ),
    instructions: this.formBuilder.array<FormControl<unknown>>(
      [],
      Validators.required
    ),
    preparationTime: this.formBuilder.group(
      {
        hours: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(23),
        ]),
        minutes: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        seconds: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
      },
      { validators: checkDurationGreaterThanZero() }
    ),
    cookingTime: this.formBuilder.group(
      {
        hours: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(23),
        ]),
        minutes: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        seconds: new FormControl<number | null>(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
      },
      { validators: checkDurationGreaterThanZero() }
    ),
    difficulty: new FormControl<string | null>(
      this.difficulties[0],
      Validators.required
    ),
    image: new FormControl<File | null>(null, [validateImageFile()]),
    mealType: this.formBuilder.group(
      {
        breakfast: new FormControl<boolean | null>(false),
        brunch: new FormControl<boolean | null>(false),
        lunch: new FormControl<boolean | null>(false),
        dinner: new FormControl<boolean | null>(false),
      },
      { validators: checkAMealTypeExists() }
    ),
    dietaryPreference: this.formBuilder.group({
      vegan: new FormControl<boolean | null>(false),
      glutenfree: new FormControl<boolean | null>(false),
    }),
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.makerForm.valid) {
      console.log(this.makerForm.value);

      this.makerForm.reset({
        preparationTime: { hours: 0, minutes: 0, seconds: 0 },
        cookingTime: { hours: 0, minutes: 0, seconds: 0 },
        difficulty: this.difficulties[0],
        mealType: {
          breakfast: false,
          brunch: false,
          lunch: false,
          dinner: false,
        },
        dietaryPreference: {
          vegan: false,
          glutenfree: false,
        },
      });
      this.ingredients.clear();
      this.instructions.clear();
    }
  }

  get ingredients() {
    return this.makerForm.get('ingredients') as FormArray<FormGroup>;
  }

  get instructions() {
    return this.makerForm.get('instructions') as FormArray<FormGroup>;
  }

  titleErrs(): { required: boolean } {
    const control = this.makerForm.get('title');
    const required = control && control.errors && control.errors['required'];

    return {
      required,
    };
  }
}
