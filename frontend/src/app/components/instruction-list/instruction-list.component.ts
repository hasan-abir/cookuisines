import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  InstructionResponse,
  PaginatedInstructions,
  RecipeService,
} from '../../services/recipe.service';
import { CommonModule } from '@angular/common';
import { RecipeDetails } from '../../pages/recipe/recipe.component';

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
  @Input() loadedRecipe: RecipeDetails = {};
  @Output() setInstructions = new EventEmitter<InstructionResponse[]>();
  @Input() url = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    if (this.loadedRecipe.instructions) {
      this.paginatedInstructions.results = this.loadedRecipe.instructions;
    } else {
      this.fetchInstructions();
    }
  }

  fetchInstructions(nextUrl?: string) {
    this.isProcessing = true;
    const fetchUrl = nextUrl || this.url;

    this.recipeService.get_instructions(fetchUrl).subscribe({
      next: (result) => {
        this.paginatedInstructions.count = result.count;
        this.paginatedInstructions.next = result.next;
        this.paginatedInstructions.previous = result.previous;

        this.paginatedInstructions.results = [
          ...this.paginatedInstructions.results,
          ...result.results,
        ];

        this.isProcessing = false;

        if (result.next) {
          this.fetchInstructions(result.next);
        } else {
          this.setInstructions.emit(this.paginatedInstructions.results);
        }
      },
    });
  }
}
