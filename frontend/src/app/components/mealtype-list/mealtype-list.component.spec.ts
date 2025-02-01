import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealtypeListComponent } from './mealtype-list.component';

describe('MealtypeListComponent', () => {
  let component: MealtypeListComponent;
  let fixture: ComponentFixture<MealtypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealtypeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealtypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
