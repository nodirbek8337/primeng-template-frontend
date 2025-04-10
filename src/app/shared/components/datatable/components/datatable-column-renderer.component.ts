import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'datatable-column-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="!cellRendererComponent && !cellRendererFn">
      <span>{{ row?.[field] }}</span>
    </ng-container>

    <ng-container *ngIf="cellRendererFn">
      <span [innerHTML]="cachedValue"></span>
    </ng-container>

    <ng-template #container></ng-template>
  `,
})
export class DatatableColumnRendererComponent implements OnChanges {
  @Input() field!: string;
  @Input() row!: any;
  @Input() cellRendererComponent?: any;
  @Input() cellRendererFn?: (row: any, field: string) => string;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;
  cachedValue: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    const rowChanged =
      changes['row'] &&
      !this.deepEqual(changes['row'].previousValue, changes['row'].currentValue);

    const fieldChanged =
      changes['field'] &&
      changes['field'].previousValue !== changes['field'].currentValue;

    const shouldReloadComponent =
      (rowChanged || fieldChanged) &&
      this.cellRendererComponent &&
      !this.cellRendererFn;

    const shouldUpdateFnResult =
      (rowChanged || fieldChanged) &&
      this.cellRendererFn &&
      !this.cellRendererComponent;

    if (shouldReloadComponent) {
      this.loadComponent();
    }

    if (shouldUpdateFnResult && this.row && this.field) {
      this.cachedValue = this.cellRendererFn!(this.row, this.field);
    }
  }

  loadComponent() {
    this.container.clear();
    this.componentRef = this.container.createComponent(this.cellRendererComponent);
    this.componentRef.instance.rowData = this.row;
    this.componentRef.instance.field = this.field;
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
