import { Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, Type, ComponentRef, inject } from '@angular/core';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DefaultService } from '../../services/default.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'prime-datatable',
  templateUrl: './prime-datatable.component.html',
  styleUrls: ['./prime-datatable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [ConfirmationService],
})
export class PrimeDatatableComponent implements OnInit, OnChanges {
  @Input() _defaultService!: DefaultService;
  @ViewChild('formContainer', { read: ViewContainerRef }) formContainer!: ViewContainerRef;
  formRef: ComponentRef<any> | null = null;

  @Input() formComponent!: Type<any>;
  @Input() tableTitle?: string;
  @Input() columnDefs: any[] = [];
  @Input() rows: number = 15;
  @Input() rowsPerPageOptions: number[] = [15, 30, 50];
  @Input() hasCreate: boolean = false;
  @Input() hasAction: boolean = false;
  @Input() hasRefreshBtn: boolean = false;
  @Input() hasClearFilterBtn: boolean = false;
  @Input() hasRowIndex: boolean = false;

  @Output() onRefresh = new EventEmitter<void>();
  @Output() onRowClick = new EventEmitter<any>();

  value: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  columnFilters: { [key: string]: any } = {};

  editMode = false;
  editData: any = {};
  showEditDialog = false;

  private dataLoadedOnce = false;
  private currentPageStartIndex = 0;
  private filterTimeout: any;

  confirmationService = inject(ConfirmationService);

  constructor() {}

  ngOnInit(): void {
    if (this.hasRowIndex) this.addRowIndexColumn();
  
    this._defaultService.reloadDataTable.subscribe(() => this.reload());
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
    setTimeout(() => this.loadFormComponent(row._id), 0);
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
    this.reload();
  }

  handleRowClick(event: any) {
    this.onRowClick.emit(event.data);
  }

  onColumnFilter(value: string, field: string) {
    if (!(value && value.trim() !== '')) {
      delete this.columnFilters[field];
    }
  
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
  
    this.filterTimeout = setTimeout(() => {
      this.applyFilters();
    }, 1000);
  }

  applyFilters() {
    const formattedFilters: any = {};
  
    for (const key in this.columnFilters) {
      const value = this.columnFilters[key];
  
      if (value && value.trim() !== '') {
        formattedFilters[key] = { value, matchMode: 'contains' };
      }
    }
  
    this.reload(formattedFilters);
  }

  isFilterEmpty(): boolean {
    return Object.keys(this.columnFilters).length === 0;
  }

  loadData(event: TableLazyLoadEvent) {
    if (!this._defaultService || !this._defaultService.tableRequest) {
      console.warn('[PrimeDatatable] DefaultService or tableRequest not ready.');
      return;
    }

    const request = this._defaultService.tableRequest;
    request.setPageParamsPrimeNg(event.first ?? 0, event.rows ?? this.rows);
    this.currentPageStartIndex = event.first ?? 0;

    if (event.sortField && event.sortOrder !== null && event.sortOrder !== undefined) {
      const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      request.setSortParamsPrimeNg({
        field: sortField,
        order: event.sortOrder ?? 1
      });
    }

    if (event.filters) {
      request.setFilterParams(event.filters);
    }

    this.loading = true;

    this._defaultService.reloadTable().subscribe({
      next: (res) => {
        this.value = res.data?.map((item: any, index: number) => ({
          rowIndex: this.currentPageStartIndex + index + 1,
          ...item
        })) ?? [];
    
        this.totalRecords = res.pagination?.total ?? res.total ?? res.data?.total ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err); 
        this.value = [];
        this.totalRecords = 0;
        this.loading = false; 
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_defaultService'] && changes['_defaultService'].currentValue && !this.dataLoadedOnce) {
      const waitForRequest = setInterval(() => {
        const request = this._defaultService?.tableRequest;
        if (request) {
          clearInterval(waitForRequest);
          this.dataLoadedOnce = true;
          this.reload();
        }
      }, 50);
    }
  }

  private reload(filters: any = {}) {
    const reloadEvent: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
      filters
    };
    this.loadData(reloadEvent);
  }

  clearAllFilters() {
    this.columnFilters = {};
    this.applyFilters();
  }

  private addRowIndexColumn() {
    this.columnDefs.unshift({
      field: 'rowIndex',
      header: '#',
      sortable: false,
      searchable: false,
      style: { width: '60px', textAlign: 'center' }
    });
  }

  loadFormComponent(_id: any = null) {
    if (!this.formComponent || !this.formContainer) return;
  
    this.formContainer.clear();
    this.formRef = this.formContainer.createComponent(this.formComponent);
    this.formRef.instance.model = { ...this.editData };
  
    this.formRef.instance.onClose = () => {
      this.showEditDialog = false;
    };
  
    this.formRef.instance.onSubmitted = (formData: any) => {
      const save$ = this.editMode && _id
        ? this._defaultService.update(formData, _id)
        : this._defaultService.insert(formData);
  
      save$.subscribe({
        next: () => {
          this.showEditDialog = false;
        },
        error: () => {
          this.showEditDialog = false;
        }
      });
    };
  }
}
