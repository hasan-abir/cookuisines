import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealtypesComponent } from './mealtypes.component';

describe('MealtypesComponent', () => {
  let component: MealtypesComponent;
  let fixture: ComponentFixture<MealtypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealtypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
