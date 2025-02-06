import { Component, Input } from '@angular/core';
import {
  InstructionResponse,
  PaginatedInstructions,
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
  paginatedInstructions: PaginatedInstructions = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.fetchInstructions();
  }

  fetchMoreInstructions() {
    if (this.paginatedInstructions.next) {
      this.fetchInstructions(this.paginatedInstructions.next);
    }
  }

  fetchInstructions(nextUrl?: string) {
    this.isProcessing = true;

    this.recipeService.get_instructions(nextUrl || this.url).subscribe({
      next: (result) => {
        this.paginatedInstructions.count = result.count;
        this.paginatedInstructions.next = result.next;
        this.paginatedInstructions.previous = result.previous;

        this.paginatedInstructions.results = [
          ...this.paginatedInstructions.results,
          ...result.results,
        ];

        this.isProcessing = false;
      },
    });
  }
}
