/**
 * Notifications Page
 */

import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '@hooks/useNotificationQueries';
import { Button } from '@components/ui/Button';
import './NotificationsPage.css';

export function NotificationsPage(): JSX.Element {
  const { data: notifications, isLoading } = useNotifications({ limit: 100 });
  const markAllAsReadMutation = useMarkAllAsRead();
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleMarkRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div className="tf-notifications">
      <div className="tf-notifications__header">
        <div>
          <h1 className="tf-notifications__title">Notifications</h1>
          <p className="tf-notifications__subtitle">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" onClick={handleMarkAllRead} isLoading={markAllAsReadMutation.isPending}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <p style={{ padding: '40px', textAlign: 'center', color: '#9196a0' }}>Loading notifications...</p>
      ) : (
        <div className="tf-notifications__list">
          {notifications?.length === 0 ? (
            <div className="tf-notifications__empty">
              <span style={{ fontSize: '48px' }}>🔔</span>
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div
                key={notification.id}
                className={`tf-notifications__item ${!notification.is_read ? 'tf-notifications__item--unread' : ''}`}
                onClick={() => !notification.is_read && handleMarkRead(notification.id)}
              >
                <div className="tf-notifications__icon">
                  {notification.type === 'task_assigned' && '📋'}
                  {notification.type === 'comment' && '💬'}
                  {notification.type === 'task_due' && '⏰'}
                  {notification.type === 'mention' && '@'}
                  {notification.type === 'project_invite' && '👥'}
                </div>
                <div className="tf-notifications__content">
                  <p className="tf-notifications__message">{notification.message}</p>
                  <span className="tf-notifications__time">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                {!notification.is_read && <span className="tf-notifications__dot" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
