/**
 * Button Component
 * 
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm, md, lg
 * 
 * Usage:
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses = 'tf-button';
    const variantClass = `tf-button--${variant}`;
    const sizeClass = `tf-button--${size}`;
    const loadingClass = isLoading ? 'tf-button--loading' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="tf-button__spinner" />
        ) : (
          <>
            {leftIcon && <span className="tf-button__icon--left">{leftIcon}</span>}
            <span className="tf-button__content">{children}</span>
            {rightIcon && <span className="tf-button__icon--right">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
