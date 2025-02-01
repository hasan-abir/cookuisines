import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  DietaryPreferenceResponse,
  RecipeService,
} from '../../services/recipe.service';

@Component({
  selector: 'app-dietarypreference-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dietarypreference-list.component.html',
  styleUrl: './dietarypreference-list.component.css',
})
export class DietarypreferenceListComponent {
  isProcessing = false;
  dietarypreference: DietaryPreferenceResponse | null = null;
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchDietarypreference();
  }

  fetchDietarypreference() {
    this.isProcessing = true;

    this.recipeService.get_dietarypreference(this.url).subscribe({
      next: (result) => {
        this.dietarypreference = result;

        this.isProcessing = false;
      },
    });
  }
}
