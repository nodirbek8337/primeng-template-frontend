import { Component, inject, ComponentRef, Input, Output, EventEmitter, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DefaultService } from '../../services/default.service';
import { CommonModule } from '@angular/common';
import { TableFeatureBaseComponent } from './table-feature-base/table-feature-base.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatepickerRangeComponent } from '../datepicker-range/datepicker-range.component';
import { DatatableActionsComponent } from "./components/datatable-actions.component";
import { DatatableColumnRendererComponent } from "./components/datatable-column-renderer.component";
import { ICustomAction } from '../../interfaces/custom-action.interface';


@Component({
    selector: 'prime-datatable',
    templateUrl: './prime-datatable.component.html',
    styleUrls: ['./prime-datatable.component.scss'],
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    DatepickerRangeComponent,
    DatatableActionsComponent,
    DatatableColumnRendererComponent
],
    providers: [ConfirmationService]
})
export class PrimeDatatableComponent extends TableFeatureBaseComponent {
    @Input() _defaultService!: DefaultService;
    @ViewChild('formContainer', { read: ViewContainerRef }) formContainer!: ViewContainerRef;
    formRef: ComponentRef<any> | null = null;

    @Input() formComponent!: Type<any>;
    @Input() tableTitle?: string;
    @Input() columnDefs: any[] = [];
    @Input() rowsPerPageOptions: number[] = [15, 30, 50];
    @Input() hasCreate: boolean = false;
    @Input() hasAction: boolean = false;
    @Input() hasRefreshBtn: boolean = false;
    @Input() hasClearFilterBtn: boolean = false;

    @Output() onRefresh = new EventEmitter<void>();
    @Output() onRowClick = new EventEmitter<any>();

    confirmationService = inject(ConfirmationService);

    @Input() customActions: ICustomAction[] = [];

    isSubmitting = false;

    constructor() {
        super();
    }

    triggerAdd() {
        this.editData = {};
        this.editMode = false;
        this.showEditDialog = true;
        setTimeout(() => this.loadFormComponent(), 0);
    }

    triggerEdit(row: any) {
        this.editData = row;
        this.editMode = true;
        this.showEditDialog = true;
        const id = row?._id ?? row?.id ?? null;
        setTimeout(() => this.loadFormComponent(id), 0);
    }

    triggerDelete(row: any) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this item?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._defaultService.delete(row._id).subscribe({
                    next: () => this.reload(),
                    error: (err) => console.error('Delete error:', err)
                });
            }
        });
    }

    triggerRefresh() {
      this.onRefresh.emit();
      this.applyFilters(); 
    }
    

    handleRowClick(event: any) {
        this.onRowClick.emit(event.data);
    }

    loadFormComponent(_id: any = null) {
        if (!this.formComponent || !this.formContainer) return;
        this.formContainer.clear();
        this.formRef = this.formContainer.createComponent(this.formComponent);
        this.formRef.instance.model = { ...this.editData };

        this.formRef.instance.onClose = () => {
            this.showEditDialog = false;
        };

        this.formRef.instance.loading = false;

        this.formRef.instance.onSubmitted = (formData: any) => {
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            this.formRef!.instance.loading = true;

            const save$ = this.editMode && _id 
                ? this._defaultService.update(formData, _id) 
                : this._defaultService.insert(formData);

            save$.subscribe({
                next: () => {
                    this.isSubmitting = false;
                    this.showEditDialog = false;
                    this.formRef!.instance.loading = false;
                    this.reload();
                },
                error: () => {
                    this.isSubmitting = false;
                    this.formRef!.instance.loading = false;
                    this.showEditDialog = false;
                }
            });
        };
    }
}
