/**
 * Skeleton Component
 * 
 * Loading placeholder for content.
 * 
 * Usage:
 * <Skeleton width="100%" height="20px" />
 * <Skeleton.Circle size={40} />
 */

import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'rect' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  width = '100%',
  height = '20px',
  variant = 'rect',
  animation = 'pulse',
}: SkeletonProps): JSX.Element {
  const className = `tf-skeleton tf-skeleton--${variant} tf-skeleton--${animation}`;

  return (
    <span
      className={className}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}

/**
 * Skeleton Text - Multiple lines of skeleton text
 */
export function SkeletonText({
  lines = 3,
  width = '100%',
}: {
  lines?: number;
  width?: string;
}): JSX.Element {
  return (
    <div className="tf-skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : width}
          height="16px"
          variant="text"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Card - Card-shaped loading placeholder
 */
export function SkeletonCard(): JSX.Element {
  return (
    <div className="tf-skeleton-card">
      <Skeleton width="100%" height="120px" />
      <div style={{ padding: '16px' }}>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
