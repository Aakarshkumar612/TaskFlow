/**
 * Team and Project-related TypeScript types
 */

/** Team visibility options */
export type TeamVisibility = 'public' | 'private';

/** Team member roles */
export type TeamMemberRole = 'admin' | 'member';

/** Project member roles */
export type ProjectMemberRole = 'admin' | 'member' | 'viewer';

/** Project status */
export type ProjectStatus = 'active' | 'archived' | 'completed';

/** Team entity from API */
export interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  visibility: TeamVisibility;
  created_at: string;
  updated_at: string;
}

/** Team member entity */
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  joined_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

/** Project entity from API */
export interface Project {
  id: string;
  name: string;
  description: string | null;
  team_id: string;
  owner_id: string;
  status: ProjectStatus;
  color: string;
  start_date: string | null;
  due_date: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

/** Project member entity */
export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

/** Section entity (for Kanban columns) */
export interface Section {
  id: string;
  name: string;
  project_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}
