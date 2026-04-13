/**
 * Settings Page - With Clerk Integration
 */

import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import './SettingsPage.css';

export function SettingsPage(): JSX.Element {
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();

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
  const userCreatedAt = clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : 'Unknown';

  return (
    <div className="tf-settings">
      <h1 className="tf-settings__title">Settings</h1>

      <div className="tf-settings__section">
        <h2 className="tf-settings__section-title">Profile</h2>
        <div className="tf-settings__profile">
          <Avatar name={userName} imageUrl={userAvatar} size="xl" showStatus status="online" />
          <div className="tf-settings__profile-info">
            <p className="tf-settings__profile-name">{userName}</p>
            <p className="tf-settings__profile-email">{userEmail}</p>
            <p className="tf-settings__profile-meta">Member since {userCreatedAt}</p>
          </div>
        </div>
      </div>

      <div className="tf-settings__section">
        <h2 className="tf-settings__section-title">Account</h2>
        <div className="tf-settings__info-grid">
          <div className="tf-settings__info-item">
            <label className="tf-settings__info-label">Full Name</label>
            <p className="tf-settings__info-value">{userName}</p>
          </div>
          <div className="tf-settings__info-item">
            <label className="tf-settings__info-label">Email</label>
            <p className="tf-settings__info-value">{userEmail}</p>
          </div>
          <div className="tf-settings__info-item">
            <label className="tf-settings__info-label">User ID</label>
            <p className="tf-settings__info-value tf-settings__info-value--mono">{clerkUser?.id || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="tf-settings__section">
        <h2 className="tf-settings__section-title">Session</h2>
        <div className="tf-settings__actions">
          <Button variant="ghost" onClick={handleSignOut}>
            🚪 Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
