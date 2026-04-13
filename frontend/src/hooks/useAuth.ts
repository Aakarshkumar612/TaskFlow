/**
 * useAuth Hook - Clerk Integration
 *
 * Provides authentication state using Clerk's hooks.
 */

import { useCallback } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { clearTokenGetter } from '@services/api';
import type { User } from '@model/auth.types';

/**
 * Hook to access authentication state
 */
export function useAuth() {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();

  const stableGetToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getToken();
    } catch {
      return null;
    }
  }, [getToken]);

  // Convert Clerk user to our User type
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        avatar_url: clerkUser.imageUrl || null,
        timezone: 'UTC',
        email_verified_at: clerkUser.emailAddresses[0]?.verification?.status === 'verified'
          ? new Date().toISOString()
          : null,
        last_login_at: new Date().toISOString(),
        created_at: new Date(clerkUser.createdAt || Date.now()).toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;

  return {
    user,
    isAuthenticated: isSignedIn || false,
    isLoading: !isLoaded,
    error: null,
    getToken: stableGetToken,
    signOut: async () => {
      try {
        await clerk.signOut();
        clearTokenGetter();
        window.location.href = '/';
      } catch {
        window.location.href = '/';
      }
    },
  };
}
