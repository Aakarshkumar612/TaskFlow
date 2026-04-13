/**
 * UI Slice
 * 
 * Manages UI state:
 * - Sidebar open/close
 * - Active modal
 * - Theme preference
 * - Loading overlays
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'dark' | 'light';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  theme: Theme;
  loadingOverlay: boolean;
  loadingMessage: string | null;
  taskDetailOpen: boolean;
  taskDetailId: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  theme: 'dark',
  loadingOverlay: false,
  loadingMessage: null,
  taskDetailOpen: false,
  taskDetailId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = null;
    },

    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    showLoadingOverlay: (state, action: PayloadAction<string | undefined>) => {
      state.loadingOverlay = true;
      state.loadingMessage = action.payload || null;
    },

    hideLoadingOverlay: (state) => {
      state.loadingOverlay = false;
      state.loadingMessage = null;
    },

    openTaskDetail: (state, action: PayloadAction<string>) => {
      state.taskDetailOpen = true;
      state.taskDetailId = action.payload;
    },

    closeTaskDetail: (state) => {
      state.taskDetailOpen = false;
      state.taskDetailId = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  openModal,
  closeModal,
  setTheme,
  showLoadingOverlay,
  hideLoadingOverlay,
  openTaskDetail,
  closeTaskDetail,
} = uiSlice.actions;

export default uiSlice.reducer;
