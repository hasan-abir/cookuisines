import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { handleErrors } from '../../../utils/error.utils';
import { FormselectfieldsComponent } from '../../formselectfields/formselectfields.component';
import { RecipeDetails } from '../../pages/recipe/recipe.component';
import {
  DietaryPreferenceBody,
  DietaryPreferenceResponse,
  IngredientBody,
  IngredientResponse,
  InstructionBody,
  InstructionResponse,
  MealTypeBody,
  MealTypeResponse,
  RecipeBody,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { Duration, MakerForm, MakerFormVal } from '../../types/MakerForm';
import {
  checkDurationGreaterThanZero,
  DurationpickerComponent,
} from '../durationpicker/durationpicker.component';
import {
  FileuploadComponent,
  validateImageFile,
} from '../fileupload/fileupload.component';
import { FormgrouparrayComponent } from '../formgrouparray/formgrouparray.component';
import { durationStringToObj } from '../../../utils/time.utils';
import { HttpClient } from '@angular/common/http';
import {
  createBooleanGroup,
  createFormControl,
  durationGroup,
  populateFormArray,
  shortenObj,
} from '../../../utils/form.utils';

interface FullRecipe {
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

  @Input() fullRecipe: FullRecipe | null = null;

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
    if (this.fullRecipe) {
      const main = this.fullRecipe.main;
      const details = this.fullRecipe.details;

      this.httpClient.get(main.image_url, { responseType: 'blob' }).subscribe({
        next: (val: Blob) => {
          let filename = 'image.jpeg';
          if (val.type == 'image/png') {
            filename = 'image.png';
          }

          this.makerForm.patchValue({
            image: new File([val], filename, {
              type: val.type,
              lastModified: new Date().getTime(),
            }),
          });
        },
      });

      this.makerForm.patchValue({
        title: main.title,
        difficulty: main.difficulty,
        preparationTime: durationStringToObj(main.preparation_time),
        cookingTime: durationStringToObj(main.cooking_time),
      });

      if (
        details.meal_type &&
        details.dietary_preference &&
        details.ingredients &&
        details.instructions
      ) {
        this.makerForm.patchValue({
          mealType: shortenObj(details.meal_type, [
            'breakfast',
            'brunch',
            'lunch',
            'dinner',
          ]),
          dietaryPreference: shortenObj(details.dietary_preference, [
            'vegan',
            'glutenfree',
          ]),
        });

        populateFormArray<IngredientResponse>(
          this.formBuilder,
          this.makerForm.get('ingredients') as FormArray<FormGroup>,
          details.ingredients,
          ['url', 'name', 'quantity']
        );

        populateFormArray<InstructionResponse>(
          this.formBuilder,
          this.makerForm.get('instructions') as FormArray<FormGroup>,
          details.instructions,
          ['url', 'step']
        );
      }

      this.isEditing = true;
    }
  }

  resetFormPartially(nestedFields?: boolean) {
    if (nestedFields) {
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
    } else {
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
  }

  formatDuration(duration: Duration) {
    return `${duration.hours.toString().padStart(2, '0')}:${duration.minutes
      .toString()
      .padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`;
  }

  createFullRecipe() {
    const value = this.makerForm.value as MakerFormVal;

    const recipeBody: RecipeBody = {
      title: value.title,
      cooking_time: this.formatDuration(value.cookingTime),
      preparation_time: this.formatDuration(value.preparationTime),
      difficulty: value.difficulty,
      image: value.image,
    };

    this.recipeService.create_recipe(recipeBody).subscribe({
      next: (recipe) => {
        this.resetFormPartially();

        const nestedRequests: Observable<any>[] =
          this.recipeService.createNestedRecipeRequests(recipe, value);

        combineLatest(nestedRequests).subscribe({
          complete: () => {
            this.isProcessing = false;

            this.resetFormPartially(true);
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

  editFullRecipe() {}

  onSubmit() {
    if (this.makerForm.valid) {
      this.errMsgs = [];
      this.isProcessing = true;

      if (this.isEditing) {
        this.editFullRecipe();
      } else {
        this.createFullRecipe();
      }
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
