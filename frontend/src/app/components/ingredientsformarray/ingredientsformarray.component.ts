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

@Component({
  selector: 'app-ingredientsformarray',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredientsformarray.component.html',
  styleUrl: './ingredientsformarray.component.css',
})
export class IngredientsformarrayComponent {
  @Input() ingredients: FormArray<FormGroup> = new FormArray<any>([]);
  @Input() makerForm: FormGroup<{
    title: FormControl<string | null>;
    ingredients: FormArray<FormControl<unknown>>;
  }> = new FormGroup({
    title: new FormControl(''),
    ingredients: new FormArray<FormControl<unknown>>([]),
  });

  constructor(private formBuilder: FormBuilder) {}

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    if (this.ingredients) {
      this.ingredients.removeAt(index);
    }
  }

  ingredientsErrs(): { required: boolean } {
    const required =
      this.ingredients.errors && this.ingredients.errors['required'];

    return {
      required,
    };
  }
}
