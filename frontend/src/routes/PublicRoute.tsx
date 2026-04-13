/**
 * Public Route Component
 * 
 * Redirects to dashboard if user is already authenticated.
 * Used for login/register pages to prevent access when logged in.
 * 
 * Usage:
 * <Route element={<PublicRoute />}>
 *   <Route path="/auth/login" element={<LoginPage />} />
 * </Route>
 */

import { Navigate, useLocation, Outlet } from 'react-router-dom';

export function PublicRoute(): JSX.Element {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  // Already authenticated - redirect to intended page or dashboard
  if (token) {
    const from = location.state?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Not authenticated - show login/register
  return <Outlet />;
}
