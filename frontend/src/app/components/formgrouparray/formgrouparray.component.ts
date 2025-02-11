import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Field {
  name: string;
  type: string;
  label: string;
}

@Component({
  selector: 'app-formgrouparray',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formgrouparray.component.html',
  styleUrl: './formgrouparray.component.css',
})
export class FormgrouparrayComponent {
  @Input() form: FormGroup = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });
  @Input() formArrName = 'items';
  @Input() fields: Field[] = [];
  @Input() requiredMsg = '';

  constructor(private formBuilder: FormBuilder) {}

  addItem() {
    const formControls: any = {};

    this.fields.forEach((field) => {
      formControls[field.name] = ['', Validators.required];
    });

    const itemForm = this.formBuilder.group(formControls);

    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  itemsErrs(): { required: boolean } {
    const required = this.items.errors && this.items.errors['required'];

    return {
      required,
    };
  }

  get items() {
    return this.form.get(this.formArrName) as FormArray<FormGroup>;
  }
}
