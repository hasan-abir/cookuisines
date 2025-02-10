import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basepage',
  standalone: true,
  imports: [],
  templateUrl: './basepage.component.html',
  styleUrl: './basepage.component.css',
})
export class BasepageComponent {
  @Input() heading: string = '';
  @Input() isCentered: boolean = false;
}
