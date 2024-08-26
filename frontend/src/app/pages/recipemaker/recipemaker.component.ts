import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
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

  addIngredient(value: string, event?: Event) {
    if (event) {
      event.preventDefault();

      value = (event.target as HTMLInputElement).value;
    }

    if (value) {
      this.makerForm.controls.ingredients.push(
        this.formBuilder.nonNullable.control(value)
      );
    }

    if (value && event) {
      (event.target as HTMLInputElement).value = '';
    }
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
}
