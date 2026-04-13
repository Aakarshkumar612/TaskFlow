/**
 * Authentication Service - Clerk Integration
 *
 * NOTE: This service is deprecated for now.
 * When Clerk is integrated, authentication will be handled by Clerk SDK:
 * - import { useSignIn, useSignUp, useUser } from '@clerk/clerk-react'
 * 
 * The backend auth endpoints (/auth/login, /auth/register, etc.) do not exist.
 * Clerk manages authentication state via React Context and secure cookies.
 *
 * TODO: When Clerk is integrated:
 * - Install @clerk/clerk-react
 * - Use Clerk's hooks and components instead of this service
 * - Remove all functions below
 */

import { User } from '@model/auth.types';

/**
 * Placeholder type definitions
 * These will be replaced by Clerk's TypeScript types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

/**
 * Get current user profile
 * 
 * TODO: Replace with Clerk's useUser() hook
 * Example: const { user } = useUser();
 */
export async function getCurrentUser(): Promise<User | null> {
  // TODO: Implement with Clerk
  console.warn('getCurrentUser not implemented - Clerk not integrated yet');
  return null;
}

/**
 * Update user profile
 * 
 * TODO: Replace with Clerk's user.update() method
 */
export async function updateUser(_data: Partial<User>): Promise<User | null> {
  // TODO: Implement with Clerk
  console.warn('updateUser not implemented - Clerk not integrated yet');
  return null;
}

