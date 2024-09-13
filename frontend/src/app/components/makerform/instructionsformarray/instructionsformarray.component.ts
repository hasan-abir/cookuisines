import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { initialMakerForm } from '../../../pages/recipemaker/recipemaker.component';
import { MakerForm } from '../../../types/MakerForm';

@Component({
  selector: 'app-instructionsformarray',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructionsformarray.component.html',
  styleUrl: './instructionsformarray.component.css',
})
export class InstructionsformarrayComponent {
  @Input() instructions: FormArray<FormGroup> = new FormArray<any>([]);
  @Input() makerForm: MakerForm = initialMakerForm;

  constructor(private formBuilder: FormBuilder) {}

  addInstruction() {
    const ingredientForm = this.formBuilder.group({
      step: ['', Validators.required],
    });

    this.instructions.push(ingredientForm);
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  instructionsErrs(): { required: boolean } {
    const required =
      this.instructions.errors && this.instructions.errors['required'];

    return {
      required,
    };
  }
}
