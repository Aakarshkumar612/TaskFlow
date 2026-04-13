/**
 * TaskCard Component
 */

import { useNavigate } from 'react-router-dom';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import type { Task } from '@model/task.types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export function TaskCard({ task, compact }: TaskCardProps): JSX.Element {
  const navigate = useNavigate();

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'done': return 'success';
      case 'in_progress': return 'primary';
      case 'review': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div
      className={`tf-task-card ${compact ? 'tf-task-card--compact' : ''}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      {!compact && (
        <div className="tf-task-card__header">
          <span className="tf-task-card__project">{task.project_id}</span>
          {task._count && task._count.comments > 0 && (
            <span className="tf-task-card__comments">💬 {task._count.comments}</span>
          )}
        </div>
      )}
      <h4 className="tf-task-card__title">{task.title}</h4>
      <div className="tf-task-card__meta">
        <div className="tf-task-card__badges">
          <Badge variant={priorityVariant(task.priority)} dot>{task.priority}</Badge>
          <Badge variant={statusVariant(task.status)}>{task.status.replace('_', ' ')}</Badge>
        </div>
        <div className="tf-task-card__footer">
          {task.due_date && <span className="tf-task-card__due">📅 {task.due_date}</span>}
          {task.assignee && <Avatar name={task.assignee.name} size="xs" />}
        </div>
      </div>
    </div>
  );
}
