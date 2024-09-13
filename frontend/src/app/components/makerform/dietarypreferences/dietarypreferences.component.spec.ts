import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietarypreferencesComponent } from './dietarypreferences.component';

describe('DietarypreferencesComponent', () => {
  let component: DietarypreferencesComponent;
  let fixture: ComponentFixture<DietarypreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietarypreferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietarypreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
