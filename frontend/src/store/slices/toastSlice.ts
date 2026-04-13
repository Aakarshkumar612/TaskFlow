/**
 * Toast Slice
 * 
 * Manages toast notifications state.
 * Note: We use react-hot-toast for rendering,
 * but this slice tracks toast-related state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  code?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

interface ToastState {
  toasts: Toast[];
  maxToasts: number;
}

const initialState: ToastState = {
  toasts: [],
  maxToasts: 5,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id' | 'timestamp'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };

      // Add to beginning
      state.toasts.unshift(toast);

      // Remove oldest if over limit
      if (state.toasts.length > state.maxToasts) {
        state.toasts = state.toasts.slice(0, state.maxToasts);
      }
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },

    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
