import { Component, Input } from '@angular/core';
import { MakerForm } from '../../types/MakerForm';
import { initialMakerForm } from '../../pages/recipemaker/recipemaker.component';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function checkAMealTypeExists(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const breakfast = control.get('breakfast')?.value;
    const brunch = control.get('brunch')?.value;
    const lunch = control.get('lunch')?.value;
    const dinner = control.get('dinner')?.value;

    if (!breakfast && !brunch && !lunch && !dinner) {
      return { mealTypeExists: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-mealtypes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mealtypes.component.html',
  styleUrl: './mealtypes.component.css',
})
export class MealtypesComponent {
  @Input() makerForm: MakerForm = initialMakerForm;

  mealTypeErrs(): { mealTypeExists: boolean } {
    const control = this.makerForm.get('mealType');

    const mealTypeExists =
      control && control.errors && control.errors['mealTypeExists'];

    return {
      mealTypeExists,
    };
  }
}
