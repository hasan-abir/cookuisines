import { Component, Input } from '@angular/core';
import {
  InstructionResponse,
  RecipeService,
} from '../../services/recipe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instruction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instruction-list.component.html',
  styleUrl: './instruction-list.component.css',
})
export class InstructionListComponent {
  isProcessing = false;
  instructions: InstructionResponse[] = [];
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchInstructions();
  }

  fetchInstructions() {
    this.isProcessing = true;

    this.recipeService.get_instructions(this.url).subscribe({
      next: (result) => {
        this.instructions = result.results;

        this.isProcessing = false;
      },
    });
  }
}
