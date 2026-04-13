/**
 * Register Form Component - Clerk Integration Placeholder
 *
 * This component will be replaced by Clerk's pre-built Sign Up component.
 * Currently redirects to dashboard since auth is not required.
 *
 * TODO: When Clerk is integrated:
 * - Install @clerk/clerk-react
 * - Replace with <SignUp /> component from Clerk
 * - Add Clerk provider to app root
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import './AuthForm.css';

export function RegisterForm(): JSX.Element {
  const navigate = useNavigate();

  // For now, just redirect to dashboard
  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="tf-auth">
      <div className="tf-auth__card">
        <div className="tf-auth__header">
          <h1 className="tf-auth__title">Authentication Coming Soon</h1>
          <p className="tf-auth__subtitle">
            Clerk authentication will be integrated shortly.
          </p>
        </div>

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', color: '#9196a0' }}>
            You're currently using the application without authentication.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
