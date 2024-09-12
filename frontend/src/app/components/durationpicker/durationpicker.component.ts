import { Component, Input } from '@angular/core';
import { initialMakerForm } from '../../pages/recipemaker/recipemaker.component';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MakerForm } from '../../types/MakerForm';

export function checkDurationGreaterThanZero(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hours = control.get('hours')?.value;
    const minutes = control.get('minutes')?.value;
    const seconds = control.get('seconds')?.value;

    if (hours > 0 || minutes > 0 || seconds > 0) {
      return null;
    } else {
      return { durationGreaterThanZero: true };
    }
  };
}

@Component({
  selector: 'app-durationpicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './durationpicker.component.html',
  styleUrl: './durationpicker.component.css',
})
export class DurationpickerComponent {
  @Input() fgName: string = '';
  @Input() form: MakerForm = initialMakerForm;

  timeErrs(): { durationGreaterThanZero: boolean } {
    const control = this.form.get(this.fgName);

    const durationGreaterThanZero =
      control && control.errors && control.errors['durationGreaterThanZero'];

    return {
      durationGreaterThanZero,
    };
  }
}
