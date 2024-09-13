import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsformarrayComponent } from './ingredientsformarray.component';

describe('IngredientsformarrayComponent', () => {
  let component: IngredientsformarrayComponent;
  let fixture: ComponentFixture<IngredientsformarrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsformarrayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngredientsformarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
