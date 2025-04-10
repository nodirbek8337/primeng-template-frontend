import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-date-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span>
    {{ rowData?.[field] | date: 'dd MMM yyyy, HH:mm' }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDateRendererComponent {
  @Input() rowData!: any;
  @Input() field!: string;
}
