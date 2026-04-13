/**
 * Auth Slice - Simplified for Clerk Integration
 *
 * Manages user profile data from Clerk.
 * Tokens and session management handled by Clerk SDK.
 *
 * TODO: When Clerk is integrated:
 * - Remove this Redux slice entirely
 * - Use Clerk's useUser() hook directly
 * - Clerk manages its own state via React Context
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@model/auth.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set user profile data from Clerk
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Clear user profile (on sign out)
     */
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Update user profile fields
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUser, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
