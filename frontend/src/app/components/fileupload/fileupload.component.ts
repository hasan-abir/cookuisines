import { Component, Input } from '@angular/core';
import {
  initialMakerForm,
  MakerForm,
} from '../../pages/recipemaker/recipemaker.component';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  @Input() makerForm: MakerForm = initialMakerForm;

  previewImg: string | null = null;

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files.item(0);
    this.image?.setValue(file);

    if (this.image && this.image.value && this.image.valid) {
      const reader = new FileReader();

      reader.readAsDataURL(this.image.value);
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          this.previewImg = e.target.result;
        }
      };
    } else {
      this.previewImg = null;
    }
  }

  get image() {
    return this.makerForm.get('image') as FormControl<File | null>;
  }

  removeImage() {
    this.image?.setValue(null);
    this.previewImg = null;
  }

  imageErrs(): { invalidFileType: boolean; invalidFileSize: boolean } {
    const control = this.image;
    const invalidFileType =
      control && control.errors && control.errors['invalidFileType'];
    const invalidFileSize =
      control && control.errors && control.errors['invalidFileSize'];

    return {
      invalidFileType,
      invalidFileSize,
    };
  }
}
