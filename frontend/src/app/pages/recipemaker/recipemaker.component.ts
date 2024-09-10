import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IngredientsformarrayComponent } from '../../components/ingredientsformarray/ingredientsformarray.component';
import { InstructionsformarrayComponent } from '../../components/instructionsformarray/instructionsformarray.component';
import {
  checkDurationGreaterThanZero,
  DurationpickerComponent,
} from '../../components/durationpicker/durationpicker.component';

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
}>;

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
});

function validateImageFile(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (!file) {
      return null;
    }
    const validTypes = ['image/jpeg', 'image/png'];

    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= 2000000;

    if (isValidType && isValidSize) {
      return null;
    } else if (!isValidType && isValidSize) {
      return { invalidFileType: true };
    } else if (isValidType && !isValidSize) {
      return { invalidFileSize: true };
    } else {
      return { invalidFileType: true };
    }
  };
}

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
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.makerForm.valid) {
      console.log(this.makerForm.value);

      this.makerForm.reset({
        preparationTime: { hours: 0, minutes: 0, seconds: 0 },
        cookingTime: { hours: 0, minutes: 0, seconds: 0 },
        difficulty: this.difficulties[0],
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

  get image() {
    return this.makerForm.get('image') as FormControl<File | null>;
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files.item(0);
    this.makerForm.get('image')?.setValue(file);

    console.log(file);
  }

  titleErrs(): { required: boolean } {
    const control = this.makerForm.get('title');
    const required = control && control.errors && control.errors['required'];

    return {
      required,
    };
  }
  imageErrs(): { invalidFileType: boolean; invalidFileSize: boolean } {
    const control = this.makerForm.get('image');
    const invalidFileType =
      control && control.errors && control.errors['invalidFileType'];
    const invalidFileSize =
      control && control.errors && control.errors['invalidFileSize'];

    return {
      invalidFileType,
      invalidFileSize,
    };
  }
}
