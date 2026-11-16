export type RestResponse<T> = SucceedRestResponse<T> | FailureRestResponse;

export type SucceedRestResponse<T> = {
  succeed: true;
  data: T;
};

export type FailureRestResponse = {
  succeed: false;
  failure: Failure;
};

export type Failure = {
  failureMessageKey: string;
  failureLabelKeys?: string[];
};

export interface DataRecord {
  dataStatus: DataStatus;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export enum DataStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export interface Pagination {
  pageNum: number;
  pageSize: number;
}

export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  pages: number;
  total: number;
  list: T[];
}
