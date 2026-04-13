/**
 * Authentication-related TypeScript types
 *
 * Simplified for Clerk integration.
 * Token management handled by Clerk SDK.
 */

/** User roles within the application */
export type UserRole = 'admin' | 'member' | 'viewer';

/** User entity from Clerk API */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  timezone: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}
