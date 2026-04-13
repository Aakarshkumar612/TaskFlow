/**
 * TASKFLOW Error Codes
 * 
 * Every feature has unique error codes for debugging & tracking.
 * Format: FEATURE-XXX
 * 
 * Usage:
 *   toast.error('AUTH-001', 'Invalid email or password');
 */

export const ERROR_CODES = {
  // Authentication (AUTH-001 to AUTH-099)
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH-001',
    EMAIL_EXISTS: 'AUTH-002',
    WEAK_PASSWORD: 'AUTH-003',
    TOKEN_EXPIRED: 'AUTH-004',
    TOKEN_INVALID: 'AUTH-005',
    UNAUTHORIZED: 'AUTH-006',
    SESSION_EXPIRED: 'AUTH-007',
    EMAIL_NOT_VERIFIED: 'AUTH-008',
    ACCOUNT_LOCKED: 'AUTH-009',
    NETWORK_ERROR: 'AUTH-010',
  },
  
  // Teams (TEAM-001 to TEAM-099)
  TEAM: {
    NOT_FOUND: 'TEAM-001',
    CREATE_FAILED: 'TEAM-002',
    UPDATE_FAILED: 'TEAM-003',
    DELETE_FAILED: 'TEAM-004',
    MEMBER_ADD_FAILED: 'TEAM-005',
    MEMBER_REMOVE_FAILED: 'TEAM-006',
    PERMISSION_DENIED: 'TEAM-007',
    ALREADY_MEMBER: 'TEAM-008',
  },
  
  // Projects (PROJ-001 to PROJ-099)
  PROJECT: {
    NOT_FOUND: 'PROJ-001',
    CREATE_FAILED: 'PROJ-002',
    UPDATE_FAILED: 'PROJ-003',
    DELETE_FAILED: 'PROJ-004',
    MEMBER_ADD_FAILED: 'PROJ-005',
    MEMBER_REMOVE_FAILED: 'PROJ-006',
    PERMISSION_DENIED: 'PROJ-007',
    ARCHIVE_FAILED: 'PROJ-008',
  },
  
  // Tasks (TASK-001 to TASK-099)
  TASK: {
    NOT_FOUND: 'TASK-001',
    CREATE_FAILED: 'TASK-002',
    UPDATE_FAILED: 'TASK-003',
    DELETE_FAILED: 'TASK-004',
    ASSIGN_FAILED: 'TASK-005',
    STATUS_UPDATE_FAILED: 'TASK-006',
    PERMISSION_DENIED: 'TASK-007',
    DEPENDENCY_CYCLE: 'TASK-008',
    SUBTASK_LIMIT_EXCEEDED: 'TASK-009',
    DRAG_DROP_FAILED: 'TASK-010',
  },
  
  // Comments (COMM-001 to COMM-099)
  COMMENT: {
    NOT_FOUND: 'COMM-001',
    CREATE_FAILED: 'COMM-002',
    UPDATE_FAILED: 'COMM-003',
    DELETE_FAILED: 'COMM-004',
    PERMISSION_DENIED: 'COMM-005',
  },
  
  // Notifications (NOTIF-001 to NOTIF-099)
  NOTIFICATION: {
    FETCH_FAILED: 'NOTIF-001',
    MARK_READ_FAILED: 'NOTIF-002',
    MARK_ALL_READ_FAILED: 'NOTIF-003',
    DELETE_FAILED: 'NOTIF-004',
  },
  
  // File Upload (FILE-001 to FILE-099)
  FILE: {
    UPLOAD_FAILED: 'FILE-001',
    FILE_TOO_LARGE: 'FILE-002',
    INVALID_TYPE: 'FILE-003',
    DELETE_FAILED: 'FILE-004',
    DOWNLOAD_FAILED: 'FILE-005',
  },
  
  // Network/API (NET-001 to NET-099)
  NETWORK: {
    TIMEOUT: 'NET-001',
    SERVER_ERROR: 'NET-002',
    RATE_LIMITED: 'NET-003',
    OFFLINE: 'NET-004',
    REQUEST_ABORTED: 'NET-005',
    VALIDATION_FAILED: 'NET-006',
  },
  
  // WebSocket (WS-001 to WS-099)
  WEBSOCKET: {
    CONNECTION_FAILED: 'WS-001',
    DISCONNECTED: 'WS-002',
    RECONNECT_FAILED: 'WS-003',
    AUTH_FAILED: 'WS-004',
  },
  
  // UI/UX (UI-001 to UI-099)
  UI: {
    RENDER_FAILED: 'UI-001',
    STATE_SYNC_FAILED: 'UI-002',
    THEME_APPLY_FAILED: 'UI-003',
  },
} as const;

/**
 * Human-readable error messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
  'AUTH-001': 'Invalid email or password. Please check your credentials.',
  'AUTH-002': 'An account with this email already exists.',
  'AUTH-003': 'Password must be at least 8 characters with 1 number and 1 special character.',
  'AUTH-004': 'Your session has expired. Please login again.',
  'AUTH-005': 'Invalid authentication token. Please login again.',
  'AUTH-006': 'You do not have permission to perform this action.',
  'AUTH-007': 'Your session has expired. Please login again.',
  'AUTH-008': 'Please verify your email address before logging in.',
  'AUTH-009': 'Account locked due to too many failed attempts. Try again later.',
  'AUTH-010': 'Network error. Please check your connection and try again.',
  
  'TEAM-001': 'Team not found. It may have been deleted.',
  'TEAM-002': 'Failed to create team. Please try again.',
  'TEAM-003': 'Failed to update team details.',
  'TEAM-004': 'Failed to delete team.',
  'TEAM-005': 'Failed to add member to team.',
  'TEAM-006': 'Failed to remove member from team.',
  'TEAM-007': 'You do not have permission to manage this team.',
  'TEAM-008': 'User is already a member of this team.',
  
  'PROJ-001': 'Project not found. It may have been deleted.',
  'PROJ-002': 'Failed to create project. Please try again.',
  'PROJ-003': 'Failed to update project details.',
  'PROJ-004': 'Failed to delete project.',
  'PROJ-005': 'Failed to add member to project.',
  'PROJ-006': 'Failed to remove member from project.',
  'PROJ-007': 'You do not have permission to manage this project.',
  'PROJ-008': 'Failed to archive project.',
  
  'TASK-001': 'Task not found. It may have been deleted.',
  'TASK-002': 'Failed to create task. Please try again.',
  'TASK-003': 'Failed to update task details.',
  'TASK-004': 'Failed to delete task.',
  'TASK-005': 'Failed to assign task.',
  'TASK-006': 'Failed to update task status.',
  'TASK-007': 'You do not have permission to modify this task.',
  'TASK-008': 'Cannot create circular task dependency.',
  'TASK-009': 'Maximum subtask limit reached (50).',
  'TASK-010': 'Failed to update task position.',
  
  'COMM-001': 'Comment not found. It may have been deleted.',
  'COMM-002': 'Failed to add comment.',
  'COMM-003': 'Failed to update comment.',
  'COMM-004': 'Failed to delete comment.',
  'COMM-005': 'You do not have permission to modify this comment.',
  
  'NOTIF-001': 'Failed to fetch notifications.',
  'NOTIF-002': 'Failed to mark notification as read.',
  'NOTIF-003': 'Failed to mark all notifications as read.',
  'NOTIF-004': 'Failed to delete notification.',
  
  'FILE-001': 'Failed to upload file.',
  'FILE-002': 'File size exceeds maximum limit (10MB).',
  'FILE-003': 'File type not supported.',
  'FILE-004': 'Failed to delete file.',
  'FILE-005': 'Failed to download file.',
  
  'NET-001': 'Request timed out. Please check your connection.',
  'NET-002': 'Server error. Please try again later.',
  'NET-003': 'Too many requests. Please wait a moment.',
  'NET-004': 'You are offline. Please check your connection.',
  'NET-005': 'Request was cancelled.',
  'NET-006': 'Validation failed. Please check your input.',
  
  'WS-001': 'Failed to connect to real-time service.',
  'WS-002': 'Disconnected from real-time service. Reconnecting...',
  'WS-003': 'Failed to reconnect. Please refresh the page.',
  'WS-004': 'WebSocket authentication failed. Please login again.',
  
  'UI-001': 'Failed to render component.',
  'UI-002': 'Failed to sync application state.',
  'UI-003': 'Failed to apply theme.',
};

/**
 * Get human-readable message from error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || 'An unexpected error occurred. Please try again.';
}
