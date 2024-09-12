import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { initialMakerForm } from '../../pages/recipemaker/recipemaker.component';
import { MakerForm } from '../../types/MakerForm';

@Component({
  selector: 'app-ingredientsformarray',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredientsformarray.component.html',
  styleUrl: './ingredientsformarray.component.css',
})
export class IngredientsformarrayComponent {
  @Input() ingredients: FormArray<FormGroup> = new FormArray<any>([]);
  @Input() makerForm: MakerForm = initialMakerForm;

  constructor(private formBuilder: FormBuilder) {}

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });

    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  ingredientsErrs(): { required: boolean } {
    const required =
      this.ingredients.errors && this.ingredients.errors['required'];

    return {
      required,
    };
  }
}
