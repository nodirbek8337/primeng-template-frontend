import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ExampleTableService } from './example-table.service';
import { NgIf } from '@angular/common';
import { ExampleTableFormComponent } from './form/example-table-form.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { PhoneNumberPipe } from '../../shared/pipes/phone-number.pipe';

@Component({
    selector: 'app-examplet-table',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './example-table.component.html',
    styleUrls: ['./example-table.component.scss'],
    providers: [DateFormatPipe, PhoneNumberPipe],
})
export class ExampleTableComponent {
    _defaultService = inject(ExampleTableService);
    private _dateFormat = inject(DateFormatPipe);
    private _phoneNumberFormat = inject(PhoneNumberPipe);

    FormComponent = ExampleTableFormComponent;

    columnDefs = [
        { field: 'name', header: 'Name', widthClass: 'w-20p' },
        {
            field: 'status',
            header: 'Status',
            widthClass: 'w-15p',
            filterType: 'dropdown',
            filterOptions: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]
        },          
        { 
            field: 'phone', 
            header: 'Phone',
            widthClass: 'w-15p',
            cellRendererFn: (row: any, field: string) => {
                const formatted = this._phoneNumberFormat.transform(row[field]);
                return `<span>${formatted}</span>`;
            }
         },
        {
            field: 'created_at',
            header: 'Created At',
            filterType: 'date-range',
            widthClass: 'w-25p',
            cellRendererComponent: CustomDateRendererComponent
        },
        {
            field: 'updated_at',
            header: 'Updated At',
            filterType: 'date-range',
            widthClass: 'w-25p',
            cellRendererFn: (row: any, field: string) => {
                const formatted = this._dateFormat.transform(row[field]);
                return `<span>${formatted}</span>`;
            }
        }
    ];

    customRowActions: ICustomAction[] = [
        // {
        //     icon: 'pi pi-eye',
        //     tooltip: 'Ko‘rish',
        //     color: 'info',
        //     action: (row) => {
        //         console.log('Ko‘rilayotgan ID:', row._id);
        //     }
        // },
        // {
        //     icon: 'pi pi-send',
        //     tooltip: 'Email yuborish',
        //     color: 'success',
        //     action: (row) => {
        //         alert('Email yuborilmoqda: ' + row.email);
        //     }
        // }
    ];
}
