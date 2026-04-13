/**
 * Authentication Middleware
 *
 * Verifies Clerk session tokens, attaches user ID to request,
 * and auto-provisions a User record in PostgreSQL if one doesn't exist.
 */

import { Request, Response, NextFunction } from 'express';
import { createClerkClient, verifyToken } from '@clerk/backend';
import prisma from '../config/database';

/**
 * Extended Request interface to include userId from Clerk session
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
}

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_your_secret_key_here',
});

/**
 * Auto-provision user in PostgreSQL if they don't exist.
 * Called after successful authentication.
 */
async function ensureUserInDb(userId: string, userData: AuthenticatedRequest['user']) {
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (existing) return;

    // Create user record
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'User';

    await prisma.user.create({
      data: {
        id: userId,
        name: fullName,
        email: userData?.email || '',
        avatar_url: userData?.imageUrl || null,
        timezone: 'UTC',
      },
    });

    console.log(`[Provision] User created in DB: ${userId}`);
  } catch (error) {
    // Log but don't fail - user can be provisioned on next request
    console.error('[Provision] Failed to create user:', error);
  }
}

/**
 * Middleware to verify authentication and extract user ID.
 *
 * Verifies the session token from the Authorization header,
 * attaches user information to the request object,
 * and ensures a User record exists in the database.
 */
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authentication token provided',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const token = authHeader.split(' ')[1];

    let verifiedToken;
    try {
      verifiedToken = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
    } catch (verifyError: any) {
      console.error('[Auth] Token verification failed:', verifyError?.message || verifyError);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authentication token',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!verifiedToken || typeof verifiedToken === 'string') {
      console.error('[Auth] Token verification returned invalid result');
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authentication token',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const userId = verifiedToken.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authentication token',
          timestamp: new Date().toISOString(),
        },
      });
    }

    req.userId = userId;
    req.user = {
      id: userId,
      email: (verifiedToken as any).email || undefined,
      firstName: (verifiedToken as any).first_name || undefined,
      lastName: (verifiedToken as any).last_name || undefined,
      imageUrl: (verifiedToken as any).image_url || undefined,
    };

    // Ensure user exists in our database (auto-provision on first request)
    await ensureUserInDb(userId, req.user);

    next();
  } catch (error) {
    console.error('[Auth] Unexpected error:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication token',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * Optional authentication - adds user info if available but doesn't require it
 */
export const optionalAuth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (verifiedToken && typeof verifiedToken !== 'string' && verifiedToken.sub) {
          req.userId = verifiedToken.sub;
          req.user = {
            id: verifiedToken.sub,
            email: (verifiedToken as any).email || undefined,
            firstName: (verifiedToken as any).first_name || undefined,
            lastName: (verifiedToken as any).last_name || undefined,
            imageUrl: (verifiedToken as any).image_url || undefined,
          };
          // Also provision optional auth users
          await ensureUserInDb(verifiedToken.sub, req.user);
        }
      } catch {
        // Silently ignore errors for optional auth
      }
    }
  } catch {
    // Silently ignore errors for optional auth
  }

  next();
};
