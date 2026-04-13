/**
 * Helper utilities for controllers
 */

import { Request } from 'express';

/**
 * Safely extract a single string ID from route params
 * Handles Express 5's string | string[] type
 */
export function getIdParam(req: Request, param: string = 'id'): string {
  const value = req.params[param];
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return '';
}

/**
 * Safely extract a string query parameter
 */
export function getQueryParam(req: Request, param: string): string | undefined {
  const value = req.query[param] as string | string[] | undefined;
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
}
