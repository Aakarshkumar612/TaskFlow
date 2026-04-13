/**
 * Axios API Service Configuration
 *
 * Features:
 * - Automatic token attachment via Clerk
 * - Request/response interceptors
 * - Error normalization
 * - AbortController support for race conditions
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse } from '@model/api.types';
import { ERROR_CODES } from '@utils/errorCodes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Token getter function - set by useAuth hook
 */
let getTokenFn: (() => Promise<string | null>) | null = null;

export function setTokenGetter(getToken: () => Promise<string | null>) {
  getTokenFn = getToken;
}

export function clearTokenGetter() {
  getTokenFn = null;
}

/**
 * Create axios instance with default config
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Attach Clerk auth token
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getTokenFn && config.headers) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[API] Failed to get token:', error);
      }
    }
    return config;
  },
  (error: AxiosError<ApiError>) => {
    return Promise.reject(normalizeError(error));
  }
);

/**
 * Response interceptor: Handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (axios.isCancel(error)) {
      return Promise.reject({
        code: ERROR_CODES.NETWORK.REQUEST_ABORTED,
        message: 'Request was cancelled',
      });
    }

    const normalizedError = normalizeError(error);
    return Promise.reject(normalizedError);
  }
);

/**
 * Backend error response shape: { success: false, error: { code, message, ... } }
 */
interface BackendErrorResponse {
  success: boolean;
  error: {
    code?: string;
    message?: string;
    timestamp?: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Normalize API errors to consistent format
 */
function normalizeError(error: AxiosError<ApiError>): ApiError {
  if (!error.response) {
    return {
      code: ERROR_CODES.NETWORK.OFFLINE,
      message: 'Network error. Please check your connection.',
      timestamp: new Date().toISOString(),
    };
  }

  const { response } = error;
  const backendError = (response.data as unknown as BackendErrorResponse)?.error;
  const backendMessage = backendError?.message;
  const backendCode = backendError?.code;
  const backendDetails = backendError?.details;

  if (response.status === 401) {
    return {
      code: backendCode || ERROR_CODES.AUTH.SESSION_EXPIRED,
      message: backendMessage || 'Session expired. Please login again.',
      timestamp: new Date().toISOString(),
    };
  }

  if (response.status === 403) {
    return {
      code: backendCode || ERROR_CODES.AUTH.UNAUTHORIZED,
      message: backendMessage || 'You do not have permission to perform this action.',
      timestamp: new Date().toISOString(),
    };
  }

  if (response.status === 422) {
    return {
      code: backendCode || ERROR_CODES.NETWORK.VALIDATION_FAILED,
      message: backendMessage || 'Validation failed. Please check your input.',
      details: backendDetails,
      timestamp: new Date().toISOString(),
    };
  }

  if (response.status === 429) {
    return {
      code: ERROR_CODES.NETWORK.RATE_LIMITED,
      message: 'Too many requests. Please wait a moment.',
      timestamp: new Date().toISOString(),
    };
  }

  if (response.status && response.status >= 500) {
    return {
      code: backendCode || ERROR_CODES.NETWORK.SERVER_ERROR,
      message: backendMessage || 'Server error. Please try again later.',
      timestamp: new Date().toISOString(),
    };
  }

  return {
    code: backendCode || ERROR_CODES.NETWORK.SERVER_ERROR,
    message: backendMessage || 'An unexpected error occurred.',
    details: backendDetails,
    timestamp: new Date().toISOString(),
  };
}

export function createAbortController(): AbortController {
  return new AbortController();
}

export async function request<T>(
  requestFn: () => Promise<{ data: ApiResponse<T> }>,
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const response = await requestFn();
    return { data: response.data.data, error: null };
  } catch (error) {
    return { data: null, error: error as ApiError };
  }
}

export default api;
