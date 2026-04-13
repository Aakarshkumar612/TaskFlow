/**
 * Protected Route Component
 * 
 * Redirects to login if user is not authenticated.
 * Preserves the intended location for post-login redirect.
 * 
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */

import { Navigate, useLocation, Outlet } from 'react-router-dom';

export function ProtectedRoute(): JSX.Element {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  // Not authenticated - redirect to login
  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Authenticated - render child routes
  return <Outlet />;
}
