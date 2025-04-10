import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { IResponseSuccess } from '../interfaces/response.interface';
import { FormType } from '../enums/Form.enum';
import { UpsTableRequest } from '../components/requests/UpsRequest';
import { environment } from '../../../environments//environment';
import { jsonToFormData, removeEmptyProperties } from '../utils/object.utils';

@Injectable({
    providedIn: 'root'
})
export abstract class DefaultService {
    _http = inject(HttpClient);
    form!: FormGroup;
    reloadDataTable = new Subject<boolean>();
    baseUrl: string = environment.apiUrl;
    public tableRequest!: UpsTableRequest;
    abstract formName: string;
    selectedRowDataToSelect = 'id';
    formType: FormType = FormType.JSON;

    protected constructor() {
        this.tableRequest = new UpsTableRequest(this.getTableUrl(), {
          order_column: 'created_at',
          order_type: 'desc'
        });
    }
      
    getAll(params: any = {}): Observable<any> {
        return this._http.get(this.getTableUrl(), { params });
    }

    getOne(id: any, params: any = {}): Observable<any> {
        return this._http.get<IResponseSuccess>(this.getTableUrl() + '/' + id, { params }).pipe(map((res: IResponseSuccess) => res.data));
    }

    insert(form: any) {
        return this._http.post(this.getTableUrl(), this.formType === FormType.FORM_DATA ? jsonToFormData(form) : form).pipe(tap(() => this.loadDataTable()));
    }

    delete(id: any) {
        return this._http.delete(this.getTableUrl() + '/' + id).pipe(tap(() => this.loadDataTable()));
    }

    update(form: any, id: any) {
        return this._http.put(this.getTableUrl() + '/' + id, this.formType === FormType.FORM_DATA ? jsonToFormData(form) : form).pipe(tap(() => this.loadDataTable()));
    }

    patch(form: any, id: any) {
        return this._http
            .patch(this.getTableUrl() + '/' + id, this.formType === FormType.FORM_DATA ? jsonToFormData(form) : form, {
                headers: { ...this.tableRequest.getHeaders() }
            })
            .pipe(tap(() => this.loadDataTable()));
    }

    setFilterTable(obj: any) {
        this.tableRequest?.setFilterParams(obj);
        this.loadDataTable();
    }

    resetForm() {
        this.form.reset();
    }

    loadDataTable() {
        this.reloadDataTable.next(true);
    }

    reloadTable(): Observable<any> {
        return this._http.request(this.tableRequest.getMethod(), this.getTableUrl(), {
            params: removeEmptyProperties(this.tableRequest.getParams())
        });
    }

    abstract getUrl(): string;

    getTableUrl(): string {
        if (this.getUrl().startsWith('assets')) {
            return this.getUrl();
        } else {
            return this.baseUrl + '/' + this.getUrl();
        }
    }
}
