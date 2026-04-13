/**
 * Badge Component
 * 
 * Variants: default, primary, success, warning, danger
 * 
 * Usage:
 * <Badge variant="success">Done</Badge>
 * <Badge variant="primary">In Progress</Badge>
 */

import { HTMLAttributes, forwardRef } from 'react';
import './Badge.css';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', dot = false, children, className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`tf-badge tf-badge--${variant} ${dot ? 'tf-badge--dot' : ''} ${className}`}
        {...props}
      >
        {dot && <span className="tf-badge__dot" />}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
