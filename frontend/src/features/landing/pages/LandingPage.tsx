/**
 * Landing Page Component
 *
 * Professional landing page for TASKFLOW - a modern task management application.
 * Shows overview of features, pricing, and a "Get Started Free" CTA.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui/Button';
import './LandingPage.css';

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth/register');
    }
  };

  const handleSignIn = () => {
    navigate('/auth/login');
  };

  return (
    <div className="tf-landing">
      {/* Navigation */}
      <nav className="tf-landing__nav">
        <div className="tf-landing__logo">
          <span className="tf-landing__logo-icon">🚀</span>
          <span className="tf-landing__logo-text">TASKFLOW</span>
        </div>
        <div className="tf-landing__nav-actions">
          <Button variant="ghost" onClick={handleSignIn} size="sm">
            Sign In
          </Button>
          <Button variant="primary" onClick={handleGetStarted} size="sm">
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="tf-landing__hero">
        <div className="tf-landing__hero-content">
          <h1 className="tf-landing__hero-title">
            Manage Your Tasks.
            <br />
            <span className="tf-landing__hero-highlight">Ship Faster.</span>
          </h1>
          <p className="tf-landing__hero-subtitle">
            The modern project management platform that helps teams organize, track, and deliver work efficiently. Built for developers, designed for everyone.
          </p>
          <div className="tf-landing__hero-actions">
            <Button variant="primary" size="lg" onClick={handleGetStarted}>
              Get Started Free →
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/auth/login')}>
              View Demo
            </Button>
          </div>
          <div className="tf-landing__hero-stats">
            <div className="tf-landing__stat">
              <span className="tf-landing__stat-value">10K+</span>
              <span className="tf-landing__stat-label">Active Users</span>
            </div>
            <div className="tf-landing__stat">
              <span className="tf-landing__stat-value">50K+</span>
              <span className="tf-landing__stat-label">Tasks Completed</span>
            </div>
            <div className="tf-landing__stat">
              <span className="tf-landing__stat-value">99.9%</span>
              <span className="tf-landing__stat-label">Uptime</span>
            </div>
          </div>
        </div>
        <div className="tf-landing__hero-visual">
          <div className="tf-landing__dashboard-preview">
            <div className="tf-landing__mock-sidebar">
              <div className="tf-landing__mock-logo">🚀 TASKFLOW</div>
              <div className="tf-landing__mock-nav-item">📊 Dashboard</div>
              <div className="tf-landing__mock-nav-item">✅ My Tasks</div>
              <div className="tf-landing__mock-nav-item">📁 Projects</div>
              <div className="tf-landing__mock-nav-item">👥 Teams</div>
            </div>
            <div className="tf-landing__mock-content">
              <div className="tf-landing__mock-header">
                <div className="tf-landing__mock-title">Dashboard</div>
                <div className="tf-landing__mock-avatar">👤</div>
              </div>
              <div className="tf-landing__mock-stats">
                <div className="tf-landing__mock-stat-card">
                  <div className="tf-landing__mock-stat-value">24</div>
                  <div className="tf-landing__mock-stat-label">Total Tasks</div>
                </div>
                <div className="tf-landing__mock-stat-card">
                  <div className="tf-landing__mock-stat-value">8</div>
                  <div className="tf-landing__mock-stat-label">In Progress</div>
                </div>
                <div className="tf-landing__mock-stat-card">
                  <div className="tf-landing__mock-stat-value">12</div>
                  <div className="tf-landing__mock-stat-label">Completed</div>
                </div>
                <div className="tf-landing__mock-stat-card">
                  <div className="tf-landing__mock-stat-value">4</div>
                  <div className="tf-landing__mock-stat-label">Projects</div>
                </div>
              </div>
              <div className="tf-landing__mock-tasks">
                <div className="tf-landing__mock-task">
                  <div className="tf-landing__mock-task-title">Design System Update</div>
                  <div className="tf-landing__mock-task-badge tf-landing__mock-task-badge--high">High</div>
                </div>
                <div className="tf-landing__mock-task">
                  <div className="tf-landing__mock-task-title">API Integration</div>
                  <div className="tf-landing__mock-task-badge tf-landing__mock-task-badge--medium">Medium</div>
                </div>
                <div className="tf-landing__mock-task">
                  <div className="tf-landing__mock-task-title">User Testing</div>
                  <div className="tf-landing__mock-task-badge tf-landing__mock-task-badge--low">Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="tf-landing__features">
        <h2 className="tf-landing__section-title">Everything you need to manage your team</h2>
        <div className="tf-landing__features-grid">
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">📋</div>
            <h3 className="tf-landing__feature-title">Task Management</h3>
            <p className="tf-landing__feature-desc">
              Create, assign, and track tasks with ease. Set priorities, deadlines, and dependencies.
            </p>
          </div>
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">📁</div>
            <h3 className="tf-landing__feature-title">Projects & Sections</h3>
            <p className="tf-landing__feature-desc">
              Organize work into projects and sections. Keep everything structured and accessible.
            </p>
          </div>
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">👥</div>
            <h3 className="tf-landing__feature-title">Team Collaboration</h3>
            <p className="tf-landing__feature-desc">
              Invite team members, assign roles, and collaborate in real-time with WebSocket updates.
            </p>
          </div>
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">🔔</div>
            <h3 className="tf-landing__feature-title">Smart Notifications</h3>
            <p className="tf-landing__feature-desc">
              Stay informed with real-time notifications for assignments, comments, and deadlines.
            </p>
          </div>
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">🔒</div>
            <h3 className="tf-landing__feature-title">Secure Authentication</h3>
            <p className="tf-landing__feature-desc">
              Enterprise-grade security with Clerk authentication. Sign in with email, Google, or GitHub.
            </p>
          </div>
          <div className="tf-landing__feature-card">
            <div className="tf-landing__feature-icon">⚡</div>
            <h3 className="tf-landing__feature-title">Real-time Updates</h3>
            <p className="tf-landing__feature-desc">
              WebSocket-powered live updates. See changes instantly without refreshing the page.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="tf-landing__cta">
        <h2 className="tf-landing__cta-title">Ready to get started?</h2>
        <p className="tf-landing__cta-subtitle">
          Join thousands of teams already using TASKFLOW to deliver better results.
        </p>
        <Button variant="primary" size="lg" onClick={handleGetStarted}>
          Get Started Free →
        </Button>
      </section>

      {/* Footer */}
      <footer className="tf-landing__footer">
        <div className="tf-landing__footer-content">
          <div className="tf-landing__footer-brand">
            <span className="tf-landing__footer-logo-icon">🚀</span>
            <span className="tf-landing__footer-logo-text">TASKFLOW</span>
          </div>
          <div className="tf-landing__footer-links">
            <a href="#" className="tf-landing__footer-link">Privacy</a>
            <a href="#" className="tf-landing__footer-link">Terms</a>
            <a href="#" className="tf-landing__footer-link">Support</a>
            <a href="#" className="tf-landing__footer-link">Contact</a>
          </div>
        </div>
        <p className="tf-landing__footer-copy">
          © {new Date().getFullYear()} TASKFLOW. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
