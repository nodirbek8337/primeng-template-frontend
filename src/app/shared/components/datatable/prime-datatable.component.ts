import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DefaultService } from '../../services/default.service';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class PrimeDatatableComponent implements OnInit, OnChanges {
  @Input() _defaultService!: DefaultService;
  @Input() tableTitle?: string;
  @Input() columnDefs: any[] = [];
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Input() hasCreate: boolean = false;
  @Input() hasRefreshBtn: boolean = false;
  @Input() hasClearFilterBtn: boolean = false;
  @Input() hasRowIndex: boolean = false;

  @Output() onAdd = new EventEmitter<void>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() onRowClick = new EventEmitter<any>();

  value: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  columnFilters: { [key: string]: any } = {};
  private dataLoadedOnce = false;
  private currentPageStartIndex = 0;
  private filterTimeout: any;

  constructor() {}

  ngOnInit(): void {
    if (this.hasRowIndex) {
      this.addRowIndexColumn();
    }
  }

  triggerAdd() {
    this.onAdd.emit();
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
}
