import { CommonModule } from '@angular/common';
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
import { combineLatest, Observable } from 'rxjs';
import { handleErrors } from '../../../utils/error.utils';
import { FormselectfieldsComponent } from '../../formselectfields/formselectfields.component';
import { RecipeDetails } from '../../pages/recipe/recipe.component';
import {
  DietaryPreferenceBody,
  IngredientBody,
  InstructionBody,
  MealTypeBody,
  RecipeBody,
  RecipeResponse,
  RecipeService,
} from '../../services/recipe.service';
import { MakerForm } from '../../types/MakerForm';
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

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

interface FullRecipe {
  main: RecipeResponse;
  details: RecipeDetails;
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

  @Input() fullRecipe: FullRecipe | null = null;

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
    private recipeService: RecipeService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    if (this.fullRecipe) {
      this.httpClient
        .get(this.fullRecipe.main.image_url, { responseType: 'blob' })
        .subscribe({
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
        title: this.fullRecipe.main.title,
        difficulty: this.fullRecipe.main.difficulty,
        preparationTime: durationStringToObj(
          this.fullRecipe.main.preparation_time
        ),
        cookingTime: durationStringToObj(this.fullRecipe.main.cooking_time),
      });
    }
  }

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

      this.recipeService.create_recipe(recipeBody).subscribe({
        next: (recipe) => {
          this.makerForm.get('title')?.reset();
          this.makerForm.get('image')?.reset();
          this.makerForm
            .get('preparationTime')
            ?.reset({ hours: 0, minutes: 0, seconds: 0 });
          this.makerForm
            .get('cookingTime')
            ?.reset({ hours: 0, minutes: 0, seconds: 0 });
          this.makerForm.get('difficulty')?.reset(this.difficulties[0]);

          const nestedRequests: Observable<any>[] = [];

          (value.ingredients as IngredientBody[]).forEach((ingredient) =>
            nestedRequests.push(
              this.recipeService.create_ingredient(
                recipe.ingredients,
                ingredient
              )
            )
          );

          (value.instructions as InstructionBody[]).forEach((instruction) =>
            nestedRequests.push(
              this.recipeService.create_instruction(
                recipe.instructions,
                instruction
              )
            )
          );

          nestedRequests.push(
            this.recipeService.create_mealtype({
              recipe: recipe.url,
              ...value.mealType,
            } as MealTypeBody)
          );

          nestedRequests.push(
            this.recipeService.create_dietarypreference({
              recipe: recipe.url,
              ...value.dietaryPreference,
            } as DietaryPreferenceBody)
          );

          combineLatest(nestedRequests).subscribe({
            complete: () => {
              this.isProcessing = false;

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
