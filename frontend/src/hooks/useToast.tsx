/**
 * useToast Hook
 * 
 * Wrapper around react-hot-toast with error code integration.
 * Every error toast shows the unique error code for debugging.
 * 
 * Usage:
 * const toast = useToast();
 * toast.error('AUTH-001', 'Invalid credentials');
 * toast.success('Task created successfully');
 */

import { toast as hotToast, ToastOptions } from 'react-hot-toast';
import { getErrorMessage } from '@utils/errorCodes';

/** Toast style options for dark theme */
const toastStyle: ToastOptions['style'] = {
  background: '#191a1b',
  color: '#f7f8f8',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '12px 16px',
  fontSize: '14px',
  fontFamily: 'Inter Variable, sans-serif',
  fontWeight: 510,
  maxWidth: '400px',
};

const duration = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

export function useToast() {
  /**
   * Show error toast with error code
   * @param code - Unique error code (e.g., 'AUTH-001')
   * @param customMessage - Optional custom message (uses default from errorCodes if not provided)
   */
  const error = (code: string, customMessage?: string): void => {
    const message = customMessage || getErrorMessage(code);
    
    hotToast.error(
      () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontWeight: 590, fontSize: '13px', color: '#ef4444' }}>
            Error: {code}
          </div>
          <div>{message}</div>
        </div>
      ),
      {
        duration: duration.error,
        style: toastStyle,
      },
    );
  };

  /**
   * Show success toast
   */
  const success = (message: string): void => {
    hotToast.success(message, {
      duration: duration.success,
      style: toastStyle,
    });
  };

  /**
   * Show warning toast
   */
  const warning = (message: string, code?: string): void => {
    hotToast(
      () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {code && (
            <div style={{ fontWeight: 590, fontSize: '13px', color: '#f59e0b' }}>
              Warning: {code}
            </div>
          )}
          <div>{message}</div>
        </div>
      ),
      {
        duration: duration.warning,
        icon: '⚠️',
        style: toastStyle,
      },
    );
  };

  /**
   * Show info toast
   */
  const info = (message: string): void => {
    hotToast(message, {
      duration: duration.info,
      icon: 'ℹ️',
      style: toastStyle,
    });
  };

  /**
   * Show loading toast (manual dismiss required)
   * @returns Toast ID for manual dismissal
   */
  const loading = (message: string): string => {
    return hotToast.loading(message, {
      duration: 0, // Stay until manually dismissed
      style: toastStyle,
    });
  };

  /**
   * Dismiss a toast by ID
   */
  const dismiss = (toastId: string): void => {
    hotToast.dismiss(toastId);
  };

  /**
   * Dismiss all toasts
   */
  const dismissAll = (): void => {
    hotToast.dismiss();
  };

  return {
    error,
    success,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
  };
}
