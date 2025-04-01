import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

interface Field {
  name: string;
  label?: string;
}

@Component({
  selector: 'app-formselectfields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formselectfields.component.html',
  styleUrl: './formselectfields.component.css',
})
export class FormselectfieldsComponent {
  @Input() form: FormGroup = this.formBuilder.group({
    item: new FormControl<boolean | null>(false),
  });
  @Input() fgName = 'item';
  @Input() fields: Field[] = [];
  @Input() label = '';

  constructor(private formBuilder: FormBuilder) {}
}
