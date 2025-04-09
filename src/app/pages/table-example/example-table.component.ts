import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ExampleTableService } from './example-table.service';
import { NgIf } from '@angular/common';
import { ExampleTableFormComponent } from './form/example-table-form.component';

@Component({
    selector: 'app-examplet-table',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './example-table.component.html',
    styleUrls: ['./example-table.component.scss'],
})
export class ExampleTableComponent {
    _defaultService = inject(ExampleTableService);

    FormComponent = ExampleTableFormComponent;

    columnDefs = [
        { field: 'name', header: 'Name' },
        { field: 'role', header: 'Role' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        { field: 'created_at', header: 'Created At' },
        { field: 'updated_at', header: 'Updated At' },
    ];
}
