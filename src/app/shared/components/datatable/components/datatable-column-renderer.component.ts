import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'datatable-column-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="!cellRendererComponent">
      <span>{{ row?.[field] }}</span>
    </ng-container>
    <ng-template #container></ng-template>
  `
})
export class DatatableColumnRendererComponent implements OnChanges {
  @Input() field!: string;
  @Input() row!: any;
  @Input() cellRendererComponent?: any;

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  componentRef?: ComponentRef<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cellRendererComponent && this.container) {
      this.loadComponent();
    }
  }

  loadComponent() {
    this.container.clear();
    this.componentRef = this.container.createComponent(this.cellRendererComponent);
    this.componentRef.instance.rowData = this.row;
    this.componentRef.instance.field = this.field;
  }
}
