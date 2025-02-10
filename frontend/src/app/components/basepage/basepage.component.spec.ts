import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasepageComponent } from './basepage.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [BasepageComponent],
  template: `
    <app-basepage heading="Test Heading" [isCentered]="isCentered">
      <p>Projected Content</p>
    </app-basepage>
  `,
})
class TestHostComponent {
  isCentered = false;
}

describe('BasepageComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the heading and children', () => {
    const headingEl = compiled.querySelector('h1');
    const paragraphEl = compiled.querySelector('p');

    expect(headingEl?.textContent?.trim()).toBe('Test Heading');
    expect(paragraphEl?.textContent).toBe('Projected Content');
    expect(headingEl?.classList.contains('has-text-centered')).toBeFalse();
  });

  it('should center the heading', () => {
    component.isCentered = true;
    fixture.detectChanges();

    const headingEl = compiled.querySelector('h1');

    expect(headingEl?.classList.contains('has-text-centered')).toBeTrue();
  });
});
