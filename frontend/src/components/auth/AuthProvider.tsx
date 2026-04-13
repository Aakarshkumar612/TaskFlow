/**
 * Auth Provider Component
 *
 * Globally registers the Clerk token getter with the API service
 * so all API calls have authentication tokens attached.
 */

import { useRef, useEffect, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setTokenGetter, clearTokenGetter } from '@services/api';

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { isLoaded } = useUser();
  const { isSignedIn, getToken } = useClerkAuth();
  const prevSignedInRef = useRef<boolean | null>(null);

  const stableGetToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getToken();
    } catch {
      return null;
    }
  }, [getToken]);

  // Only register/clear when auth state actually changes
  useEffect(() => {
    if (!isLoaded) return;

    const wasSignedIn = prevSignedInRef.current;
    const nowSignedIn = isSignedIn;

    // Skip if state hasn't changed
    if (wasSignedIn === nowSignedIn && wasSignedIn !== null) {
      return;
    }

    if (nowSignedIn) {
      setTokenGetter(stableGetToken);
      prevSignedInRef.current = true;
    } else if (wasSignedIn === true) {
      clearTokenGetter();
      prevSignedInRef.current = false;
    } else {
      // Initial load, signed out
      prevSignedInRef.current = false;
    }
  }, [isLoaded, isSignedIn, stableGetToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTokenGetter();
    };
  }, []);

  return <>{children}</>;
}
