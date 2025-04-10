import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-date-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span style="background-color: aquamarine; padding: 0.5rem">
      {{ rowData?.[field] | date: 'dd MMM yyyy, HH:mm' }}
    </span>
  `
})
export class CustomDateRendererComponent {
  @Input() rowData!: any;
  @Input() field!: string;
}
