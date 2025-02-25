import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BasepageComponent } from '../../components/basepage/basepage.component';
import { DurationpickerComponent } from '../../components/durationpicker/durationpicker.component';
import { FileuploadComponent } from '../../components/fileupload/fileupload.component';
import { FormgrouparrayComponent } from '../../components/formgrouparray/formgrouparray.component';
import { RecipecreateoreditComponent } from '../../components/recipecreateoredit/recipecreateoredit.component';
import { FormselectfieldsComponent } from '../../formselectfields/formselectfields.component';

@Component({
  selector: 'app-recipemaker',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DurationpickerComponent,
    FileuploadComponent,
    BasepageComponent,
    FormgrouparrayComponent,
    FormselectfieldsComponent,
    RecipecreateoreditComponent,
  ],
  templateUrl: './recipemaker.component.html',
  styleUrl: './recipemaker.component.css',
})
export class RecipemakerComponent {}
