import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipemakerComponent } from './recipemaker.component';

describe('RecipemakerComponent', () => {
  let component: RecipemakerComponent;
  let fixture: ComponentFixture<RecipemakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipemakerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipemakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
