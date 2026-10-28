'use client';

import React, { useState } from 'react';
import { User, Clapperboard, Music2, Film, Popcorn } from 'lucide-react';

interface AvatarProps {
  src: string | null | undefined;
  alt: string;
  role?: string;
  className?: string;
  fallbackText?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  role,
  className = "w-10 h-10",
  fallbackText
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute initials (e.g. "Christopher Nolan" -> "CN")
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'Director':
        return <Clapperboard className="w-4 h-4 text-amber-400" />;
      case 'Actor':
        return <User className="w-4 h-4 text-rose-400" />;
      case 'Music':
        return <Music2 className="w-4 h-4 text-cyan-400" />;
      case 'Producer':
        return <Film className="w-4 h-4 text-purple-400" />;
      default:
        return <Popcorn className="w-4 h-4 text-emerald-400" />;
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`${className} rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 shadow shrink-0 select-none overflow-hidden`}
        title={alt}
      >
        {fallbackText ? (
          <span className="text-[11px] tracking-tight">{fallbackText}</span>
        ) : alt ? (
          <span className="text-xs font-black tracking-wider text-amber-400">
            {getInitials(alt)}
          </span>
        ) : (
          getRoleIcon()
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${className} rounded-full object-cover border border-zinc-700 shadow shrink-0`}
      loading="lazy"
    />
  );
};
