import { Component, Input } from '@angular/core';
import { MakerForm } from '../../../types/MakerForm';
import { initialMakerForm } from '../../../pages/recipemaker/recipemaker.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dietarypreferences',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dietarypreferences.component.html',
  styleUrl: './dietarypreferences.component.css',
})
export class DietarypreferencesComponent {
  @Input() makerForm: MakerForm = initialMakerForm;
}
