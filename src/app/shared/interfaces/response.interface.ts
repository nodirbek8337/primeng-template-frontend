import { ERROR_RESPONSE_CODE } from "../enums/Errors.enum";

export interface IErrorResponse {
  traceId: string;
  code: ERROR_RESPONSE_CODE;
  message: string;
  details?: IErrorResponseDetail[];
  time?: string;
}

export interface IErrorResponseDetail {
  field: string;
  message: string;
}

export interface IResponse {
  errorKey: null | string[];
  errorMessage: null | string[];
  timestamp?: number;
}

export interface IResponseSuccess extends IResponse {
  data: any;
}

export interface IResponseError extends IResponse {
  data: null;
}
