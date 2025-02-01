import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietarypreferenceListComponent } from './dietarypreference-list.component';

describe('DietarypreferenceListComponent', () => {
  let component: DietarypreferenceListComponent;
  let fixture: ComponentFixture<DietarypreferenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietarypreferenceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietarypreferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
