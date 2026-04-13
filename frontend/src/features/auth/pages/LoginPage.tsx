/**
 * Login Page Component - Clerk Integration
 *
 * Uses Clerk's pre-built SignIn component for authentication.
 */

import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import '../components/AuthForm.css';

export function LoginPage(): JSX.Element {
  return (
    <div className="tf-auth">
      <div className="tf-auth__bg">
        <div className="tf-auth__pattern" />
      </div>
      <div className="tf-auth__card">
        <div className="tf-auth__header">
          <Link to="/" className="tf-auth__logo">
            <span className="tf-auth__logo-icon">🚀</span>
            <span className="tf-auth__logo-text">TASKFLOW</span>
          </Link>
          <h1 className="tf-auth__title">Welcome back</h1>
          <p className="tf-auth__subtitle">
            Sign in to your account to continue
          </p>
        </div>

        <div className="tf-auth__form">
          <SignIn
            routing="path"
            path="/auth/login"
            fallbackRedirectUrl="/dashboard"
            signUpFallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                },
                card: {
                  background: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  padding: 0,
                },
                formButtonPrimary: {
                  background: '#7170ff',
                  '&:hover': {
                    background: '#5f5ee6',
                  },
                },
                footerActionLink: {
                  color: '#7170ff',
                },
                identityPreviewText: {
                  color: '#f7f8f8',
                },
                formFieldInput: {
                  background: '#1e1f20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#f7f8f8',
                },
                formFieldLabel: {
                  color: '#9196a0',
                },
                dividerLine: {
                  background: 'rgba(255, 255, 255, 0.08)',
                },
                socialButtonsBlockButton: {
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#f7f8f8',
                },
                socialButtonsBlockButtonText: {
                  color: '#f7f8f8',
                },
                formFieldInputGroupText: {
                  color: '#9196a0',
                },
                footer: {
                  display: 'none',
                },
              },
            }}
          />
        </div>

        <div className="tf-auth__footer">
          <p>
            Don't have an account?{' '}
            <Link to="/auth/register" className="tf-auth__link">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
