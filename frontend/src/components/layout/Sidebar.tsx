/**
 * Sidebar Component
 *
 * Features:
 * - Collapsible
 * - Navigation links
 * - Real notification count
 * - Real projects from API
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNotifications } from '@hooks/useNotificationQueries';
import { useProjects } from '@hooks/useProjectQueries';
import './Sidebar.css';

export function Sidebar(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  // Get real notification count
  const { data: notifications } = useNotifications({ limit: 50 });
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  // Get real projects from API
  const { data: projects } = useProjects({ limit: 5 });
  const recentProjects = projects?.slice(0, 5) || [];

  const mainNavItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '✅', label: 'My Tasks', path: '/tasks' },
    { icon: '🔔', label: 'Notifications', path: '/notifications', badge: unreadCount > 0 ? unreadCount : undefined },
    { icon: '👥', label: 'Teams', path: '/teams' },
    { icon: '📁', label: 'Projects', path: '/projects' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`tf-sidebar ${collapsed ? 'tf-sidebar--collapsed' : ''}`}>
      <div className="tf-sidebar__header">
        <NavLink to="/dashboard" className="tf-sidebar__logo">
          <span className="tf-sidebar__logo-icon">🚀</span>
          {!collapsed && <span className="tf-sidebar__logo-text">TASKFLOW</span>}
        </NavLink>
        <button
          className="tf-sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="tf-sidebar__nav">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `tf-sidebar__item ${isActive ? 'tf-sidebar__item--active' : ''}`
            }
          >
            <span className="tf-sidebar__icon">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="tf-sidebar__label">{item.label}</span>
                {item.badge && <span className="tf-sidebar__badge">{item.badge}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="tf-sidebar__section">
          <h3 className="tf-sidebar__section-title">Recent Projects</h3>
          <div className="tf-sidebar__projects">
            {recentProjects.length === 0 ? (
              <p className="tf-sidebar__empty-text" style={{ fontSize: '12px', color: '#656870', padding: '8px 0' }}>
                No projects yet
              </p>
            ) : (
              recentProjects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="tf-sidebar__project"
                >
                  <span className="tf-sidebar__project-dot" style={{ background: project.color || '#7170ff' }} />
                  <span className="tf-sidebar__project-name">{project.name}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
