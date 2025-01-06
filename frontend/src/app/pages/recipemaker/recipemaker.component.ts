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
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DietarypreferencesComponent } from '../../components/makerform/dietarypreferences/dietarypreferences.component';
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
import { MealtypesComponent } from '../../components/makerform/mealtypes/mealtypes.component';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeBody,
  RecipeService,
} from '../../services/recipe.service';
import { MakerForm } from '../../types/MakerForm';
import { concat } from 'rxjs';
import { handleErrors } from '../../../utils/error.utils';

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

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
    RouterLink,
    RouterLinkActive,
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
  errMsgs: string[] = [];
  isProcessing = false;

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
    image: new FormControl<File | null>(null, [
      Validators.required,
      validateImageFile(),
    ]),
    mealType: this.formBuilder.group({
      breakfast: new FormControl<boolean | null>(false),
      brunch: new FormControl<boolean | null>(false),
      lunch: new FormControl<boolean | null>(false),
      dinner: new FormControl<boolean | null>(false),
    }),
    dietaryPreference: this.formBuilder.group({
      vegan: new FormControl<boolean | null>(false),
      glutenfree: new FormControl<boolean | null>(false),
    }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService
  ) {}

  formatDuration(duration: Duration) {
    return `${duration.hours.toString().padStart(2, '0')}:${duration.minutes
      .toString()
      .padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.makerForm.valid) {
      const value = this.makerForm.value;
      this.errMsgs = [];
      this.isProcessing = true;
      const recipeBody: RecipeBody = {
        title: value.title as string,
        cooking_time: value.cookingTime
          ? this.formatDuration(value.cookingTime as Duration)
          : '',
        preparation_time: value.preparationTime
          ? this.formatDuration(value.preparationTime as Duration)
          : '',
        difficulty: value.difficulty as 'easy' | 'medium' | 'hard',
        image: value.image as File,
      };

      console.log(value);

      this.recipeService.create_recipe(recipeBody).subscribe({
        next: (recipe) => {
          const ingredientsRequest = (
            value.ingredients as IngredientBody[]
          ).map((ingredient) =>
            this.recipeService.create_ingredient(recipe.ingredients, ingredient)
          );

          const instructionsRequest = (
            value.instructions as InstructionBody[]
          ).map((instruction) =>
            this.recipeService.create_instruction(
              recipe.instructions,
              instruction
            )
          );

          const mealtypeRequest = this.recipeService.create_mealtype({
            recipe: recipe.url,
            ...value.mealType,
          } as MealTypeBody);

          const dietarypreferenceRequest =
            this.recipeService.create_dietarypreference({
              recipe: recipe.url,
              ...value.dietaryPreference,
            } as DietaryPreferenceBody);

          concat(
            ingredientsRequest,
            instructionsRequest,
            mealtypeRequest,
            dietarypreferenceRequest
          ).subscribe({
            complete: () => {
              this.isProcessing = false;

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
              (this.makerForm.get('ingredients') as FormArray)?.clear();
              (this.makerForm.get('instructions') as FormArray)?.clear();
            },
            error: (err) => {
              this.errMsgs = handleErrors(err);

              this.isProcessing = false;
            },
          });
        },
        error: (err) => {
          this.errMsgs = handleErrors(err);

          this.isProcessing = false;
        },
      });
    }
  }

  titleErrs(): { required: boolean } {
    const control = this.makerForm.get('title');
    const required = control && control.errors && control.errors['required'];

    return {
      required,
    };
  }
}
