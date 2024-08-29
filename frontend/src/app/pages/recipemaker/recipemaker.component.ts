import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IngredientsformarrayComponent } from '../../components/ingredientsformarray/ingredientsformarray.component';

@Component({
  selector: 'app-recipemaker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IngredientsformarrayComponent,
  ],
  templateUrl: './recipemaker.component.html',
  styleUrl: './recipemaker.component.css',
})
export class RecipemakerComponent {
  makerForm = this.formBuilder.group({
    title: ['', Validators.required],
    ingredients: this.formBuilder.array([], Validators.required),
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.makerForm.valid) {
      console.log(this.makerForm.value);

      this.makerForm.reset();
      this.ingredients.clear();
    }
  }

  get ingredients() {
    return this.makerForm.get('ingredients') as FormArray<FormGroup>;
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
