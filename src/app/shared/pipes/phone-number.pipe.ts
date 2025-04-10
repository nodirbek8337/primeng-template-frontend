import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'phoneNumber',
  standalone: true,
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const sanitizeInput = (input: string): string => {
      return input.replace(/[^0-9A-Za-z +]/g, '');
    };

    let sanitizedValue = sanitizeInput(value);
    if (sanitizedValue.startsWith('+')) {
      sanitizedValue = sanitizedValue.slice(1);
    }

    const maxLength = 12;
    sanitizedValue = sanitizedValue.slice(0, maxLength);

    if (sanitizedValue.startsWith('998') && sanitizedValue.length === 12) {
      return sanitizedValue.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
    } else {
      const localMaxLength = 9;
      sanitizedValue = sanitizedValue.slice(-localMaxLength);
      return sanitizedValue.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '+998 ($1) $2-$3-$4');
    }
  }
}
