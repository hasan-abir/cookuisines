import { Component, Input } from '@angular/core';
import {
  initialMakerForm,
  MakerForm,
} from '../../pages/recipemaker/recipemaker.component';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

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
  imports: [ReactiveFormsModule],
  templateUrl: './durationpicker.component.html',
  styleUrl: './durationpicker.component.css',
})
export class DurationpickerComponent {
  @Input() fgName: string = '';
  @Input() form: MakerForm = initialMakerForm;
}
