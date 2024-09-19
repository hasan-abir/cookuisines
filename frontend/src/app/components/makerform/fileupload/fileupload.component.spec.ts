import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { FileuploadComponent } from './fileupload.component';
import { FormControl, FormGroup } from '@angular/forms';

describe('FileuploadComponent', () => {
  let component: FileuploadComponent;
  let fixture: ComponentFixture<FileuploadComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileuploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should render component with the correct form elements', () => {
    const label = compiled.querySelector('.file-label');
    const fileInput = compiled.querySelector("input[type='file']");

    expect(label).toBeTruthy();
    expect(fileInput).toBeTruthy();
  });

  it('should update the form when the file is selected and remove the previewImg when remove button is clicked', waitForAsync(() => {
    const mockForm = new FormGroup({ image: new FormControl(null) });

    component.makerForm = mockForm as any;
    fixture.detectChanges();

    const fileInput = compiled.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const file = new File([''], 'test-image.png', { type: 'image/png' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    fileInput.dispatchEvent(new Event('change'));

    fixture
      .whenStable()
      .then(() => {
        return new Promise((resolve) => setTimeout(resolve, 10));
      })
      .then(() => {
        fixture.detectChanges();

        const previewImg = compiled.querySelector('img') as HTMLImageElement;
        const fileNameEl = compiled.querySelector(
          'span.file-name'
        ) as HTMLSpanElement;
        const removeBtn = compiled.querySelector(
          'button.is-danger'
        ) as HTMLButtonElement;
        expect(previewImg).toBeTruthy();
        expect(fileNameEl).toBeTruthy();
        expect(removeBtn).toBeTruthy();
        expect(component.image.value).toBeTruthy();

        removeBtn.click();
        fixture.detectChanges();

        expect(component.image.value).toBeNull();
        expect(component.previewImg).toBeNull();
        const updatedPreviewImg = compiled.querySelector(
          'img'
        ) as HTMLImageElement;
        const updatedFileNameEl = compiled.querySelector(
          'span.file-name'
        ) as HTMLSpanElement;
        const updatedRemoveButton = compiled.querySelector(
          'button.is-danger'
        ) as HTMLButtonElement;

        expect(updatedPreviewImg).toBeFalsy();
        expect(updatedFileNameEl).toBeFalsy();
        expect(updatedRemoveButton).toBeFalsy();
      });
  }));

  it('should show the errors when wrong file type is selected', waitForAsync(() => {
    const mockForm = new FormGroup({ image: new FormControl(null) });

    component.makerForm = mockForm as any;
    component.image.setErrors({ invalidFileType: true, invalidFileSize: true });
    fixture.detectChanges();

    const firstErrorEl = compiled.querySelectorAll(
      '.help'
    )[0] as HTMLImageElement;
    const secondErrorEl = compiled.querySelectorAll(
      '.help'
    )[1] as HTMLImageElement;
    expect(firstErrorEl).toBeTruthy();
    expect(firstErrorEl.textContent?.trim()).toBe('File must be of image type');
    expect(secondErrorEl).toBeTruthy();
    expect(secondErrorEl.textContent?.trim()).toBe(
      'File size must be under 2 mb'
    );
  }));
});
