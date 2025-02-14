import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function validateImageFile(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (!file) {
      return null;
    }
    const validTypes = ['image/jpeg', 'image/png'];

    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= 2000000;

    if (isValidType && isValidSize) {
      return null;
    } else if (!isValidType && isValidSize) {
      return { invalidFileType: true };
    } else if (isValidType && !isValidSize) {
      return { invalidFileSize: true };
    } else {
      return { invalidFileType: true };
    }
  };
}

@Component({
  selector: 'app-fileupload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.component.css',
})
export class FileuploadComponent {
  @Input() form: FormGroup = this.formBuilder.group({
    image: new FormControl(),
  });

  constructor(private formBuilder: FormBuilder) {}

  previewImg: string | null = null;

  onFileChange(event: Event) {
    return new Promise((resolve) => {
      const target = event.target as HTMLInputElement;
      const file = target.files && target.files.item(0);
      this.image?.setValue(file);

      if (this.image && this.image.value && this.image.valid) {
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            this.previewImg = e.target.result;
            resolve(null);
          }
        };
        reader.readAsDataURL(this.image.value);
      } else {
        this.previewImg = null;
        resolve(null);
      }
    });
  }

  get image() {
    return this.form.get('image') as FormControl<File | null>;
  }

  removeImage() {
    this.image?.setValue(null);
    this.previewImg = null;
  }

  imageErrs(): {
    required: boolean;
    invalidFileType: boolean;
    invalidFileSize: boolean;
  } {
    const control = this.image;
    const required = control && control.errors && control.errors['required'];
    const invalidFileType =
      control && control.errors && control.errors['invalidFileType'];
    const invalidFileSize =
      control && control.errors && control.errors['invalidFileSize'];

    return {
      required,
      invalidFileType,
      invalidFileSize,
    };
  }
}
