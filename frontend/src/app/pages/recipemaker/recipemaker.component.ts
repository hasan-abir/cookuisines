import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
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
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.makerForm.valid) {
      console.log(this.makerForm.value);

      this.makerForm.reset();
    }
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
