import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat',
    standalone: true
  })
  export class DateFormatPipe implements PipeTransform {
    transform(value: any, locale: string = 'en-US', format?: Intl.DateTimeFormatOptions): string {
      if (!value) return '';
      const date = new Date(value);
  
      const defaultFormat: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
  
      return date.toLocaleString(locale, format || defaultFormat);
    }
  }
  
