import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsformarrayComponent } from './instructionsformarray.component';

describe('InstructionsformarrayComponent', () => {
  let component: InstructionsformarrayComponent;
  let fixture: ComponentFixture<InstructionsformarrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsformarrayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructionsformarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
