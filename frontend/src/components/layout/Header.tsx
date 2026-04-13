/**
 * Header Component
 *
 * Features:
 * - Search bar
 * - Notifications (with real count)
 * - User menu with logout
 * - Breadcrumbs
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNotifications } from '@hooks/useNotificationQueries';
import { Avatar } from '@components/ui/Avatar';
import './Header.css';

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get real notification count
  const { data: notifications } = useNotifications({ limit: 50 });
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const userName = clerkUser?.fullName || clerkUser?.firstName || 'User';
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';
  const userAvatar = clerkUser?.imageUrl || '';

  return (
    <header className="tf-header">
      <div className="tf-header__left">
        <h1 className="tf-header__title">Dashboard</h1>
      </div>

      <div className="tf-header__center">
        <div className="tf-header__search">
          <span className="tf-header__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tf-header__search-input"
          />
          <kbd className="tf-header__search-kbd">⌘K</kbd>
        </div>
      </div>

      <div className="tf-header__right">
        <button
          className="tf-header__icon-btn"
          aria-label="Notifications"
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative' }}
        >
          🔔
          {unreadCount > 0 && (
            <span className="tf-header__badge">{unreadCount}</span>
          )}
        </button>

        <div className="tf-header__user">
          <button
            className="tf-header__user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar
              name={userName}
              imageUrl={userAvatar}
              size="sm"
              showStatus
              status="online"
            />
            <span className="tf-header__user-name">{userName}</span>
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div className="tf-header__user-menu" style={{ zIndex: 1000 }}>
                <div className="tf-header__user-info">
                  <Avatar name={userName} imageUrl={userAvatar} size="md" />
                  <div>
                    <p className="tf-header__user-name" style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#f7f8f8' }}>
                      {userName}
                    </p>
                    <p className="tf-header__user-email">{userEmail}</p>
                  </div>
                </div>
                <div className="tf-header__user-divider" />
                <button className="tf-header__user-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  ⚙️ Settings
                </button>
                <button className="tf-header__user-item" onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                  🏠 Dashboard
                </button>
                <div className="tf-header__user-divider" />
                <button className="tf-header__user-item tf-header__user-item--danger" onClick={handleSignOut}>
                  🚪 Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
