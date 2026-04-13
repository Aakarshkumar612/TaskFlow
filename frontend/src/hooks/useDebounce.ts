/**
 * useDebounce Hook
 * 
 * Debounces a value to prevent rapid updates.
 * Useful for search inputs, form validation, etc.
 * 
 * Usage:
 * const debouncedSearch = useDebounce(searchQuery, 300);
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
