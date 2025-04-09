type ResponseType = 'json' | 'blob';

class UpsRequestOptions {
  constructor(
    public params?: any,
    public body?: any,
    public headers?: any,
    public responseType: ResponseType = 'json'
  ) {}
}

export class UpsRequest {
  defaultParams: object = {};

  constructor(
    private url: string,
    private method = 'get',
    private options: UpsRequestOptions = {
      params: {},
      body: {},
      headers: {},
      responseType: 'json',
    }
  ) {
    this.updateParams(options.params);
    this.updateBody(options.body);
  }

  getUrl(): string {
    return this.url;
  }

  updateUrl(newUrl: string): void {
    this.url = newUrl;
  }

  getMethod(): string {
    return this.method;
  }

  updateMethod(newMethod: string): void {
    this.method = newMethod;
  }

  getResponseType(): ResponseType {
    return this.options.responseType;
  }

  getParams() {
    return this.options.params;
  }

  putParam(key: string, value: any) {
    this.options.params[key] = value;
    this.updateParams(this.options.params);
  }

  updateParams(params: object) {
    this.options.params = {
      ...params,
      ...this.defaultParams,
    };
  }

  setHeaders(headers: object) {
    this.options.headers = {
      ...headers
    };
  }

  getHeaders() {
    return this.options.headers;
  }

  resetParams(): void {
    this.options.params = {...this.defaultParams};
  }

  getBody() {
    return this.options.body;
  }

  setBody(body: any) {
    this.options.body = body;
  }

  updateBody(body: object, clear = true) {
    if (clear) {
      this.clearBody();
    }
    this.options.body = {
      ...this.options.body,
      ...body,
    };
  }

  clearBody() {
    this.options.body = {};
  }

  setSortParamsPrimeNg(sortData: { field: string; order: number }) {
    if (sortData?.field && sortData?.order !== undefined) {
      this.putParam('order_column', sortData.field);
      this.putParam('order_type', sortData.order === 1 ? 'asc' : 'desc');
    }
  }

  removeSortParams() {
    delete this.options.params?.order_column;
    delete this.options.params?.order_type;
  }
}

export class UpsGetRequest extends UpsRequest {
  constructor(url: string, params?: object) {
    super(url, 'get', new UpsRequestOptions({...params}));
  }
}

export class UpsTableRequest extends UpsRequest {
  static DEFAULT_PAGE = 1;
  static DEFAULT_SIZE = 15;
  override defaultParams: object = {};

  constructor(url: string, params?: object) {
    super(url, 'get', new UpsRequestOptions({...params}));
  }

  setPageParamsPrimeNg(first: number, rows: number) {
    const page = Math.floor(first / rows) + 1;
    this.setPageParams(page, rows);
  }

  setPageParams(page: number, size: number) {
    this.putParam('page', page);
    this.putParam('per_page', size);
  }

  setFilterParams(filters: any) {
    const cleanedFilters: any = {};
  
    for (const key in filters) {
      const filterValue = filters[key];
  
      if (filterValue && typeof filterValue === 'object' && 'value' in filterValue) {
        if (filterValue.value !== null && filterValue.value !== '') {
          cleanedFilters[key] = filterValue.value;
        }
      } else if (filterValue !== null && filterValue !== '') {
        cleanedFilters[key] = filterValue;
      }
    }
  
    const currentParams = this.getParams();
    const sortKeys = ['page', 'per_page', 'order_column', 'order_type']; 
  
    for (const key in currentParams) {
      if (!(key in cleanedFilters) && !sortKeys.includes(key)) {
        delete currentParams[key];
      }
    }
  
    const params = {
      ...currentParams,
      ...cleanedFilters,
    };
  
    this.updateParams(params);
  }
  
  removeDefaultQueries(queries: any) {
    if (queries.size === UpsTableRequest.DEFAULT_SIZE) {
      delete queries.size;
    }

    if (queries.page === UpsTableRequest.DEFAULT_PAGE) {
      delete queries.page;
    }

    if (!queries.query) {
      delete queries.query;
    }

    return queries;
  }
}

export class UpsPostRequest extends UpsRequest {
  constructor(url: string, body: object) {
    super(url, 'post', new UpsRequestOptions({}, body));
  }
}

export class UpsPatchRequest extends UpsRequest {
  constructor(url: string, body: object) {
    super(url, 'patch', new UpsRequestOptions({}, body));
  }
}

export class UpsDeleteRequest extends UpsRequest {
  constructor(url: string) {
    super(url, 'delete', new UpsRequestOptions());
  }
}
