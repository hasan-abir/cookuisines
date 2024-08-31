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
import { IngredientsformarrayComponent } from '../../components/ingredientsformarray/ingredientsformarray.component';
import { InstructionsformarrayComponent } from '../../components/instructionsformarray/instructionsformarray.component';

export type MakerForm = FormGroup<{
  title: FormControl<string | null>;
  ingredients: FormArray<FormControl<unknown>>;
  instructions: FormArray<FormControl<unknown>>;
}>;

export const initialMakerForm = new FormGroup({
  title: new FormControl(''),
  ingredients: new FormArray<FormControl<unknown>>([]),
  instructions: new FormArray<FormControl<unknown>>([]),
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
  ],
  templateUrl: './recipemaker.component.html',
  styleUrl: './recipemaker.component.css',
})
export class RecipemakerComponent {
  makerForm = this.formBuilder.group({
    title: ['', Validators.required],
    ingredients: this.formBuilder.array([], Validators.required),
    instructions: this.formBuilder.array([], Validators.required),
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.makerForm.valid) {
      console.log(this.makerForm.value);

      this.makerForm.reset();
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
    const required =
      this.makerForm.controls.title.errors &&
      this.makerForm.controls.title.errors['required'];

    return {
      required,
    };
  }
}
