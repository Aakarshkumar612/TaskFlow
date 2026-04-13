/**
 * useApi Hook
 * 
 * Data fetching hook with:
 * - AbortController for race condition prevention
 * - Loading/error states
 * - Automatic cleanup on unmount
 * 
 * Usage:
 * const { data, isLoading, error, refetch } = useApi(
 *   (signal) => getTeams({ page: 1 }, signal),
 *   [page]
 * );
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createAbortController } from '@services/api';
import { ApiError } from '@model/api.types';

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
  abort: () => void;
}

export function useApi<T>(
  fetchFn: (signal: AbortSignal) => Promise<{ data: T }>,
  dependencies: unknown[] = [],
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const controllerRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(async () => {
    // Abort any previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new abort controller
    const controller = createAbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFn(controller.signal);
      
      // Only update state if request wasn't aborted
      if (!controller.signal.aborted) {
        setData(response.data);
        setError(null);
      }
    } catch (err: unknown) {
      // Don't set error if request was aborted
      if (!controller.signal.aborted) {
        setError(err as ApiError);
        setData(null);
      }
    } finally {
      // Only update loading state if not aborted
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Auto-fetch when dependencies change
  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: executeFetch,
    abort,
  };
}

/**
 * useApiLazy Hook
 * 
 * Same as useApi but doesn't auto-fetch.
 * You control when to fetch.
 * 
 * Usage:
 * const { data, isLoading, error, execute } = useApiLazy(getTask);
 * 
 * // Later, on button click:
 * const handleView = () => execute(taskId);
 */
export function useApiLazy<T, TArgs extends unknown[]>(
  fetchFn: (...args: [...TArgs, AbortSignal?]) => Promise<{ data: T }>,
): UseApiResult<T> & { execute: (...args: TArgs) => void } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    // Abort any previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = createAbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFn(...args, controller.signal);
      
      if (!controller.signal.aborted) {
        setData(response.data);
        setError(null);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        setError(err as ApiError);
        setData(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [fetchFn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => execute(...([] as unknown as TArgs)),
    abort,
    execute,
  };
}
