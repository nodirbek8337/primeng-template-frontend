import { Directive, SimpleChanges, Input, OnChanges, OnInit } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { DefaultService } from '../../../services/default.service';

@Directive()
export abstract class TableFeatureBaseComponent implements OnInit {
    @Input() rows: number = 15;
    @Input() hasRowIndex: boolean = false;

    value: any[] = [];
    totalRecords: number = 0;
    loading: boolean = false;
    columnFilters: { [key: string]: any } = {};
    editMode = false;
    editData: any = {};
    showEditDialog = false;

    protected currentPageStartIndex = 0;
    protected filterTimeout: any;
    protected dataLoadedOnce = false;

    abstract _defaultService: DefaultService;
    abstract columnDefs: any[];

    ngOnInit(): void {
        if (!this.dataLoadedOnce && this._defaultService?.tableRequest) {
            this.dataLoadedOnce = true;
            if (this.hasRowIndex) this.addRowIndexColumn();
        }
    }

    reload(filters: any = {}) {
        const reloadEvent: TableLazyLoadEvent = {
            first: 0,
            rows: this.rows,
            filters
        };
        this.loadData(reloadEvent);
    }

    loadData(event: TableLazyLoadEvent) {
        const request = this._defaultService.tableRequest;
        request.setPageParamsPrimeNg(event.first ?? 0, event.rows ?? this.rows);
        this.currentPageStartIndex = event.first ?? 0;

        if (event.sortField && event.sortOrder !== null && event.sortOrder !== undefined) {
            const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            const sortOrder = event.sortOrder ?? 1;
            request.setSortParamsPrimeNg({ field: sortField, order: sortOrder });
        }

        if (event.filters) {
            request.setFilterParams(event.filters);
        }

        this.loading = true;

        this._defaultService.reloadTable().subscribe({
            next: (res) => {
                this.value =
                    res.data?.map((item: any, index: number) => ({
                        rowIndex: this.currentPageStartIndex + index + 1,
                        ...item
                    })) ?? [];
                this.totalRecords = res.pagination?.total ?? res.total ?? res.data?.total ?? 0;
                this.loading = false;
            },
            error: () => {
                this.value = [];
                this.totalRecords = 0;
                this.loading = false;
            }
        });
    }

    onColumnFilter(value: string, field: string) {
        if (!value?.trim()) {
            delete this.columnFilters[field];
        }

        if (this.filterTimeout) clearTimeout(this.filterTimeout);

        this.filterTimeout = setTimeout(() => {
            this.applyFilters();
        }, 1000);
    }

    applyFilters() {
        const formattedFilters: any = {};
        for (const key in this.columnFilters) {
          const value = this.columnFilters[key];
          if (value?.trim()) {
            formattedFilters[key] = { value, matchMode: 'contains' };
          }
        }
        this.reload(formattedFilters);
    }

    isFilterEmpty(): boolean {
        return Object.keys(this.columnFilters).length === 0;
    }

    clearAllFilters() {
        this.columnFilters = {};
        this.applyFilters();
    }

    protected addRowIndexColumn() {
        this.columnDefs.unshift({
            field: 'rowIndex',
            header: '#',
            sortable: false,
            searchable: false,
            style: { width: '60px', textAlign: 'center' }
        });
    }

    abstract triggerAdd(): void;
    abstract triggerEdit(row: any): void;
    abstract triggerDelete(row: any): void;
    abstract triggerRefresh(): void;
    abstract handleRowClick(event: any): void;
    abstract loadFormComponent(id?: any): void;
}
