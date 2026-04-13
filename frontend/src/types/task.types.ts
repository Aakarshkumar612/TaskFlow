/**
 * Task-related TypeScript types
 */

/** Task status options */
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

/** Task priority levels */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Task entity from API */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  section_id: string | null;
  assignee_id: string | null;
  creator_id: string;
  parent_task_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  position: number;
  tags: string[];
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  
  /** Relations (populated via API) */
  assignee?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  creator?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  subtasks?: Task[];
  _count?: {
    subtasks: number;
    comments: number;
    attachments: number;
  };
}

/** Task creation payload */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  project_id: string;
  section_id?: string;
  assignee_id?: string;
  priority?: TaskPriority;
  due_date?: string;
  tags?: string[];
}

/** Task update payload (partial) */
export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatus;
  position?: number;
  parent_task_id?: string | null;
}

/** Comment entity */
export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

/** Notification entity */
export interface Notification {
  id: string;
  user_id: string;
  type: 'task_assigned' | 'task_due' | 'comment' | 'mention' | 'project_invite';
  message: string;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  related_entity_id: string | null;
  related_entity_type: string | null;
  created_at: string;
}
