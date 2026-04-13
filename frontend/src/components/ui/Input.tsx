/**
 * Input Component
 * 
 * Features:
 * - Validation states (error, success)
 * - Left/right icons
 * - Loading state
 * - Helper text
 * 
 * Usage:
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Invalid email"
 *   placeholder="you@example.com"
 * />
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isLoading = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;
    const hasHelperText = !!helperText || !!error;

    return (
      <div className={`tf-input-wrapper ${className}`}>
        {label && (
          <label htmlFor={inputId} className="tf-input__label">
            {label}
          </label>
        )}
        <div className="tf-input__container">
          {leftIcon && <span className="tf-input__icon--left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`tf-input ${hasError ? 'tf-input--error' : ''} ${
              isLoading ? 'tf-input--loading' : ''
            }`}
            disabled={disabled || isLoading}
            aria-invalid={hasError}
            aria-describedby={hasHelperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {isLoading && <span className="tf-input__spinner" />}
          {rightIcon && !isLoading && (
            <span className="tf-input__icon--right">{rightIcon}</span>
          )}
        </div>
        {hasHelperText && (
          <p
            id={`${inputId}-helper`}
            className={`tf-input__helper ${hasError ? 'tf-input__helper--error' : ''}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
