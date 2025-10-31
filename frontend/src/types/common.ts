export type ID = string;

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}
