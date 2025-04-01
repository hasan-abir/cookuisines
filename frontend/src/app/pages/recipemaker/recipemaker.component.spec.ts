import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipemakerComponent } from './recipemaker.component';
import { Component, Input } from '@angular/core';
import { RecipecreateoreditComponent } from '../../components/recipecreateoredit/recipecreateoredit.component';

@Component({
  selector: 'app-recipecreateoredit',
  template: '',
  standalone: true,
})
class MockRecipeCreateOrEditComponent {
  @Input() heading = '';
}

describe('RecipemakerComponent', () => {
  let component: RecipemakerComponent;
  let fixture: ComponentFixture<RecipemakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipemakerComponent],
    })
      .overrideComponent(RecipemakerComponent, {
        remove: {
          imports: [RecipecreateoreditComponent],
        },
        add: {
          imports: [MockRecipeCreateOrEditComponent],
        },
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
