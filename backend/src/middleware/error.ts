/**
 * Error handling middleware
 *
 * Catches all errors and returns clean JSON responses.
 * Never exposes internal details like Prisma traces to the client.
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, string[]>;
}

/**
 * Map Prisma error codes to user-friendly messages
 */
function getPrismaErrorMessage(error: Prisma.PrismaClientKnownRequestError): { code: string; message: string } {
  switch (error.code) {
    case 'P2002': {
      // Unique constraint violation
      const target = (error.meta?.target as string[]) || [];
      return {
        code: 'DUPLICATE_ENTRY',
        message: `A record with this ${target.join(', ')} already exists.`,
      };
    }
    case 'P2003': {
      // Foreign key constraint violation
      return {
        code: 'INVALID_REFERENCE',
        message: 'The referenced record does not exist.',
      };
    }
    case 'P2025': {
      // Record not found
      return {
        code: 'NOT_FOUND',
        message: 'The requested record was not found.',
      };
    }
    case 'P2000': {
      // Value too long
      return {
        code: 'VALUE_TOO_LONG',
        message: 'One or more values exceed the maximum allowed length.',
      };
    }
    case 'P2001': {
      // Record not found in query
      return {
        code: 'NOT_FOUND',
        message: 'No records match your query.',
      };
    }
    default:
      return {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred. Please try again.',
      };
  }
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log full error for server-side debugging
  console.error(`[Error] ${err.code || 'SERVER_ERROR'}:`, err.message);
  if (err.stack) {
    console.error(err.stack.split('\n').slice(0, 3).join('\n'));
  }

  // Handle Prisma errors specifically
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = getPrismaErrorMessage(err);
    return res.status(400).json({
      success: false,
      error: {
        code: prismaError.code,
        message: prismaError.message,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data. Please check your input.',
        timestamp: new Date().toISOString(),
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = err.details || undefined;

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  });
};
