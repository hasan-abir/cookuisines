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

@Component({
  selector: 'app-recipemaker',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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
      this.makerForm.controls.ingredients.clear();
    }
  }

  get ingredients() {
    return this.makerForm.get('ingredients') as FormArray<FormGroup>;
  }

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    this.makerForm.controls.ingredients.removeAt(index);
  }

  titleErrs(): { required: boolean } {
    const required =
      this.makerForm.controls.title.errors &&
      this.makerForm.controls.title.errors['required'];

    return {
      required,
    };
  }

  ingredientsErrs(): { required: boolean } {
    const required =
      this.makerForm.controls.ingredients.errors &&
      this.makerForm.controls.ingredients.errors['required'];

    return {
      required,
    };
  }
}
