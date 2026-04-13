/**
 * Avatar Component
 * 
 * Features:
 * - Image with fallback to initials
 * - Multiple sizes
 * - Online status indicator
 * 
 * Usage:
 * <Avatar name="John Doe" imageUrl={url} size="md" status="online" />
 */

import { useState } from 'react';
import './Avatar.css';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
}

const sizeMap = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

export function Avatar({
  name,
  imageUrl,
  size = 'md',
  status = 'offline',
  showStatus = false,
}: AvatarProps): JSX.Element {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const sizePx = sizeMap[size];

  const showImage = imageUrl && !imageError;

  return (
    <div className={`tf-avatar tf-avatar--${size}`} style={{ width: sizePx, height: sizePx }}>
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="tf-avatar__image"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="tf-avatar__initials">{initials}</span>
      )}

      {showStatus && (
        <span className={`tf-avatar__status tf-avatar__status--${status}`} />
      )}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
