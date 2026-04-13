/**
 * Redux Store Configuration
 * 
 * Uses Redux Toolkit for:
 * - Auth state management
 * - UI state (sidebar, modals, theme)
 * - Toast notifications
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for toast
        ignoredActions: ['toast/addToast'],
        // Ignore these field paths for toast
        ignoredPaths: ['toast.toasts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
