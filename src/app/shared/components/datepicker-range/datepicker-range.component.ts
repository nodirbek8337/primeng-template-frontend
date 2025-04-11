import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'datepicker-range',
  standalone: true,
  templateUrl: './datepicker-range.component.html',
  imports: [FormsModule, DatePickerModule],
})
export class DatepickerRangeComponent {
  @Input() value: Date[] | null = null;
  @Output() valueChange = new EventEmitter<Date[] | null>();

  @Input() placeholder: string = 'Sanani tanlang';
  @Input() dateFormat: string = 'dd-mm-yy';
  @Input() showTime: boolean = false;

  onSelect() {
    if (this.value?.length === 2 && this.value[0] && this.value[1]) {
      const from = new Date(this.value[0]);
      const to = new Date(this.value[1]);
      to.setHours(23, 59, 59);
      this.valueChange.emit([from, to]);
    }
  }

  clear() {
    this.value = null;
    this.valueChange.emit(null);
  }
}
