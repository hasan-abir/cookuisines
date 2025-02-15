import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MealTypeResponse, RecipeService } from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mealtype-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mealtype-list.component.html',
  styleUrl: './mealtype-list.component.css',
})
export class MealtypeListComponent {
  isProcessing = false;
  mealtype: MealTypeResponse | null = null;
  @Output() setMealType = new EventEmitter<MealTypeResponse>();

  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchMealtype();
  }

  fetchMealtype() {
    this.isProcessing = true;

    this.recipeService.get_mealtype(this.url).subscribe({
      next: (result) => {
        this.mealtype = result;

        this.isProcessing = false;

        this.setMealType.emit(result);
      },
    });
  }
}
