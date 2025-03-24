import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
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
import { handleErrors } from '../../../utils/error.utils';
import {
  compareTwoObjsExistingKeys,
  createBooleanGroup,
  createFormControl,
  durationGroup,
  shortenObj,
} from '../../../utils/form.utils';
import { durationStringToObj } from '../../../utils/time.utils';
import { FormselectfieldsComponent } from '../../formselectfields/formselectfields.component';
import { RecipeDetails } from '../../pages/recipe/recipe.component';
import {
  DietaryPreferences,
  MealTypes,
  RecipeBody,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { Duration, MakerForm, MakerFormVal } from '../../types/MakerForm';
import { DurationpickerComponent } from '../durationpicker/durationpicker.component';
import {
  FileuploadComponent,
  validateImageFile,
} from '../fileupload/fileupload.component';
import { FormgrouparrayComponent } from '../formgrouparray/formgrouparray.component';

export interface FullRecipe {
  main: RecipeResponse;
  details: RecipeDetails;
}

@Component({
  selector: 'app-recipecreateoredit',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DurationpickerComponent,
    FileuploadComponent,
    FormgrouparrayComponent,
    FormselectfieldsComponent,
  ],
  templateUrl: './recipecreateoredit.component.html',
  styleUrl: './recipecreateoredit.component.css',
})
export class RecipecreateoreditComponent {
  difficulties = ['easy', 'medium', 'hard'];
  errMsgs: string[] = [];
  isProcessing = false;
  isEditing = false;
  imageLastModified = 0;

  @Input() existingRecipe: RecipeResponse | null = null;

  makerForm: MakerForm = this.formBuilder.group({
    title: createFormControl('', [Validators.required]),
    ingredients: this.formBuilder.array<FormControl<unknown>>(
      [],
      Validators.required
    ),
    instructions: this.formBuilder.array<FormControl<unknown>>(
      [],
      Validators.required
    ),
    preparationTime: durationGroup(this.formBuilder),
    cookingTime: durationGroup(this.formBuilder),
    difficulty: createFormControl(this.difficulties[0], [Validators.required]),
    image: createFormControl<File | null>(null, [
      Validators.required,
      validateImageFile(),
    ]),
    mealType: createBooleanGroup(['breakfast', 'brunch', 'lunch', 'dinner']),
    dietaryPreference: createBooleanGroup(['vegan', 'glutenfree']),
  });

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.setExistingRecipeToForm();
  }

  setExistingRecipeToForm() {
    if (this.existingRecipe) {
      this.httpClient
        .get(this.existingRecipe.image_url, { responseType: 'blob' })
        .subscribe({
          next: (val: Blob) => {
            let filename = 'image.jpeg';
            if (val.type == 'image/png') {
              filename = 'image.png';
            }

            const lastModified = new Date().getTime();
            this.makerForm.patchValue({
              image: new File([val], filename, {
                type: val.type,
                lastModified,
              }),
            });

            this.imageLastModified = lastModified;
          },
        });

      this.makerForm.patchValue({
        title: this.existingRecipe.title,
        difficulty: this.existingRecipe.difficulty,
        preparationTime: durationStringToObj(
          this.existingRecipe.preparation_time
        ),
        cookingTime: durationStringToObj(this.existingRecipe.cooking_time),
      });

      const mealType = {
        breakfast: false,
        brunch: false,
        lunch: false,
        dinner: false,
      };

      this.existingRecipe.meal_types.forEach((meal_type) => {
        if (this.makerForm.value.mealType) {
          const key = meal_type.toLowerCase().replaceAll(' ', '') as MealTypes;

          mealType[key] = true;
        }
      });

      this.makerForm.get('mealType')?.patchValue(mealType);

      const dietaryPreference = {
        vegan: false,
        glutenfree: false,
      };

      this.existingRecipe.dietary_preferences.forEach((dietary_preference) => {
        if (this.makerForm.value.dietaryPreference) {
          const key = dietary_preference
            .toLowerCase()
            .replaceAll(' ', '') as DietaryPreferences;

          dietaryPreference[key] = true;
        }
      });

      this.makerForm.get('dietaryPreference')?.patchValue(dietaryPreference);

      this.existingRecipe.ingredient_list.forEach((ingredient) => {
        (this.makerForm.get('ingredients') as FormArray<FormGroup>).push(
          this.formBuilder.group({
            nameQuantity: [ingredient, Validators.required],
          })
        );
      });

      this.existingRecipe.instruction_steps.forEach((instruction) => {
        (this.makerForm.get('instructions') as FormArray<FormGroup>).push(
          this.formBuilder.group({
            step: [instruction, Validators.required],
          })
        );
      });

      this.isEditing = true;
    }
  }

  setFormToExistingRecipe() {}

  resetForm() {
    this.makerForm.get('mealType')?.reset({
      breakfast: false,
      brunch: false,
      lunch: false,
      dinner: false,
    });
    this.makerForm.get('dietaryPreference')?.reset({
      vegan: false,
      glutenfree: false,
    });
    (this.makerForm.get('ingredients') as FormArray)?.clear();
    (this.makerForm.get('instructions') as FormArray)?.clear();
    this.makerForm.get('title')?.reset();
    this.makerForm.get('image')?.reset();
    this.makerForm
      .get('preparationTime')
      ?.reset({ hours: 0, minutes: 0, seconds: 0 });
    this.makerForm
      .get('cookingTime')
      ?.reset({ hours: 0, minutes: 0, seconds: 0 });
    this.makerForm.get('difficulty')?.reset(this.difficulties[0]);
  }

  formatDuration(duration: Duration) {
    return `${duration.hours.toString().padStart(2, '0')}:${duration.minutes
      .toString()
      .padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`;
  }

  createOrEditFullRecipe() {
    const value = this.makerForm.value as MakerFormVal;

    let recipeBody: Partial<RecipeBody> = {
      title: value.title,
      cooking_time: this.formatDuration(value.cookingTime),
      preparation_time: this.formatDuration(value.preparationTime),
      difficulty: value.difficulty,
      image: value.image,
      meal_types: Object.entries(value.mealType)
        .filter(([k, v]) => v)
        .map(([k, v]) => k) as MealTypes[],
      dietary_preferences: Object.entries(value.dietaryPreference)
        .filter(([k, v]) => v)
        .map(([k, v]) => k) as DietaryPreferences[],
      ingredient_list: value.ingredients
        .map((ingredient) => ingredient.nameQuantity.trim())
        .join('\r\n'),
      instruction_steps: value.instructions
        .map((instruction) => instruction.step.trim())
        .join('\r\n'),
    };

    let recipeRequest = this.recipeService.create_recipe(
      recipeBody as RecipeBody
    );

    if (this.isEditing && this.existingRecipe) {
      const recipeSaved: Partial<RecipeBody> = {
        ...shortenObj(this.existingRecipe, [
          'title',
          'cooking_time',
          'preparation_time',
          'difficulty',
        ]),
        ingredient_list: this.existingRecipe.ingredient_list.join('\n'),
        instruction_steps: this.existingRecipe.instruction_steps.join('\n'),
        meal_types: this.existingRecipe.meal_types.map((mealtype) =>
          mealtype.toLowerCase().replaceAll(' ', '')
        ) as MealTypes[],
        dietary_preferences: this.existingRecipe.dietary_preferences.map(
          (dietarypreference) =>
            dietarypreference.toLowerCase().replaceAll(' ', '')
        ) as DietaryPreferences[],
      };

      if (
        recipeBody.image &&
        recipeBody.image.lastModified === this.imageLastModified
      ) {
        delete recipeBody.image;
      }

      recipeBody = compareTwoObjsExistingKeys(recipeSaved, recipeBody);

      recipeRequest = this.recipeService.edit_recipe(
        this.existingRecipe.url,
        recipeBody
      );
    }

    recipeRequest.subscribe({
      next: (recipe) => {
        this.isProcessing = false;

        !this.isEditing && this.resetForm();
      },
      error: (err) => {
        this.errMsgs = handleErrors(err);

        this.isProcessing = false;
      },
    });
  }

  onSubmit() {
    if (this.makerForm.valid) {
      this.errMsgs = [];
      this.isProcessing = true;

      this.createOrEditFullRecipe();
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
