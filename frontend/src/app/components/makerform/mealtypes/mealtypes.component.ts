import { Component, Input } from '@angular/core';
import { MakerForm } from '../../../types/MakerForm';
import { initialMakerForm } from '../../../pages/recipemaker/recipemaker.component';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-mealtypes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mealtypes.component.html',
  styleUrl: './mealtypes.component.css',
})
export class MealtypesComponent {
  @Input() makerForm: MakerForm = initialMakerForm;
}
