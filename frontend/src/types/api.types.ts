/**
 * API service types
 */

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

/** API request config with AbortController */
export interface ApiRequestConfig {
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
}

/** Query parameters for list endpoints */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: unknown;
}

/** Error response from API */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}
