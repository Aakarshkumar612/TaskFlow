/**
 * Dashboard Page
 * 
 * Shows:
 * - Welcome message
 * - Quick stats
 * - Recent tasks
 * - Activity feed
 */

import { useAuth } from '@hooks/useAuth';
import { useTasks } from '@hooks/useTaskQueries';
import { useProjects } from '@hooks/useProjectQueries';
import { useTeams } from '@hooks/useTeamQueries';
import { useNotifications } from '@hooks/useNotificationQueries';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Skeleton, SkeletonText } from '@components/ui/Skeleton';
import './DashboardPage.css';

export function DashboardPage(): JSX.Element {
  const { user } = useAuth();
  
  // Fetch real data from backend
  const { data: tasks, isLoading: tasksLoading } = useTasks({ limit: 100 });
  const { data: projects, isLoading: projectsLoading } = useProjects({ limit: 100 });
  const { data: teams, isLoading: teamsLoading } = useTeams({ limit: 100 });
  const { data: notifications } = useNotifications({ limit: 50 });

  const isLoading = tasksLoading || projectsLoading || teamsLoading;

  // Calculate stats from real data
  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks?.length || 0, 
      icon: '✅', 
      change: `${tasks?.filter(t => t.status === 'todo').length || 0} pending`, 
      positive: true 
    },
    { 
      label: 'In Progress', 
      value: tasks?.filter(t => t.status === 'in_progress').length || 0, 
      icon: '🔄', 
      change: `${tasks?.filter(t => t.priority === 'urgent').length || 0} urgent`, 
      positive: false 
    },
    { 
      label: 'Completed', 
      value: tasks?.filter(t => t.status === 'done').length || 0, 
      icon: '✨', 
      change: `out of ${tasks?.length || 0} total`, 
      positive: true 
    },
    { 
      label: 'Projects', 
      value: projects?.length || 0, 
      icon: '📁', 
      change: `${teams?.length || 0} teams`, 
      positive: true 
    },
  ];

  // Get recent tasks
  const recentTasks = tasks?.slice(0, 5) || [];

  // Get recent notifications for activity feed
  const activity = notifications?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="tf-dashboard">
        <Skeleton width="200px" height="32px" />
        <SkeletonText lines={2} />
      </div>
    );
  }

  return (
    <div className="tf-dashboard">
      {/* Welcome Header */}
      <div className="tf-dashboard__header">
        <div className="tf-dashboard__welcome">
          <Avatar name={user?.name || 'User'} imageUrl={user?.avatar_url} size="lg" showStatus status="online" />
          <div>
            <h1 className="tf-dashboard__title">
              Good {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="tf-dashboard__subtitle">
              You have <strong>{tasks?.filter(t => t.status === 'in_progress').length || 0} tasks</strong> in progress and <strong>{tasks?.filter(t => t.status === 'todo').length || 0} pending</strong>
            </p>
          </div>
        </div>
        <div className="tf-dashboard__actions">
          <button className="tf-dashboard__btn tf-dashboard__btn--primary" onClick={() => window.location.href = '/tasks'}>
            + New Task
          </button>
          <button className="tf-dashboard__btn tf-dashboard__btn--secondary" onClick={() => window.location.href = '/projects'}>
            + New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="tf-dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="tf-dashboard__stat-card">
            <div className="tf-dashboard__stat-header">
              <span className="tf-dashboard__stat-icon">{stat.icon}</span>
              <span className="tf-dashboard__stat-label">{stat.label}</span>
            </div>
            <div className="tf-dashboard__stat-value">{stat.value}</div>
            <div className={`tf-dashboard__stat-change ${stat.positive ? 'tf-dashboard__stat-change--positive' : ''}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="tf-dashboard__grid">
        {/* Recent Tasks */}
        <div className="tf-dashboard__card">
          <div className="tf-dashboard__card-header">
            <h2 className="tf-dashboard__card-title">Recent Tasks</h2>
            <a href="/tasks" className="tf-dashboard__card-link">View all →</a>
          </div>
          <div className="tf-dashboard__task-list">
            {recentTasks.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#9196a0' }}>No tasks yet. Create your first task!</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="tf-dashboard__task-item">
                  <div className="tf-dashboard__task-info">
                    <span className="tf-dashboard__task-title">{task.title}</span>
                    <span className="tf-dashboard__task-meta">
                      {task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'} • {task.assignee?.name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="tf-dashboard__task-badges">
                    <Badge variant={getPriorityVariant(task.priority)} dot>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusVariant(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="tf-dashboard__card">
          <div className="tf-dashboard__card-header">
            <h2 className="tf-dashboard__card-title">Recent Activity</h2>
          </div>
          <div className="tf-dashboard__activity-list">
            {activity.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: '#9196a0' }}>No recent activity</p>
            ) : (
              activity.map((notif) => (
                <div key={notif.id} className="tf-dashboard__activity-item">
                  <Avatar name="User" size="sm" />
                  <div className="tf-dashboard__activity-content">
                    <p className="tf-dashboard__activity-text">
                      <strong>{notif.message}</strong>
                    </p>
                    <span className="tf-dashboard__activity-time">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getPriorityVariant(priority: string): 'danger' | 'warning' | 'info' | 'default' {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    default: return 'default';
  }
}

function getStatusVariant(status: string): 'primary' | 'success' | 'warning' | 'default' {
  switch (status) {
    case 'done': return 'success';
    case 'in_progress': return 'primary';
    case 'review': return 'warning';
    default: return 'default';
  }
}
