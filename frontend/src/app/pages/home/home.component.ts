import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BasepageComponent } from '../../components/basepage/basepage.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BasepageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
