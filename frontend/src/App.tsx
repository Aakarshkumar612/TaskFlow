/**
 * Main App Component - With Clerk Authentication
 *
 * Routing logic:
 * - Unauthenticated users → Landing page
 * - Authenticated users → Dashboard
 * - Auth routes (login/register) → Only for unauthenticated users
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { AppLayout } from '@components/layout/AppLayout';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { useWebSocket } from '@hooks/useWebSocket';
import { LandingPage } from '@features/landing/pages/LandingPage';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { DashboardPage } from '@features/dashboard/pages/DashboardPage';
import { TeamsPage } from '@features/teams/pages/TeamsPage';
import { ProjectsPage } from '@features/projects/pages/ProjectsPage';
import { ProjectDetailPage } from '@features/projects/pages/ProjectDetailPage';
import { TasksPage } from '@features/tasks/pages/TasksPage';
import { NotificationsPage } from '@features/notifications/pages/NotificationsPage';
import { SettingsPage } from '@features/settings/pages/SettingsPage';

/**
 * Protected Route - redirects to landing if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1011', color: '#f7f8f8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🚀</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Public Auth Route - redirects to dashboard if already authenticated
 */
function PublicAuthRoute({ children }: { children: React.ReactNode }): JSX.Element {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1011', color: '#f7f8f8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🚀</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App(): JSX.Element {
  const { isSignedIn, isLoaded } = useAuth();

  // Enable WebSocket for real-time updates (only when authenticated)
  useWebSocket(isSignedIn || false);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1011', color: '#f7f8f8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🚀</div>
          <div>Loading TASKFLOW...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        {/* Landing Page - Public */}
        <Route
          path="/"
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Auth Routes - Only for unauthenticated users */}
        <Route
          path="/auth/login"
          element={
            <PublicAuthRoute>
              <LoginPage />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicAuthRoute>
              <RegisterPage />
            </PublicAuthRoute>
          }
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeamsPage />} />
        </Route>

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProjectsPage />} />
          <Route path=":projectId" element={<ProjectDetailPage />} />
        </Route>

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TasksPage />} />
        </Route>

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
        </Route>

        {/* Catch all - redirect based on auth state */}
        <Route
          path="*"
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
