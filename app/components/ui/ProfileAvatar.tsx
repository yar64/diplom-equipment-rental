// app/components/ui/ProfileAvatar.tsx
'use client';

import { User } from 'lucide-react';

interface ProfileAvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onEdit?: () => void;
  compact?: boolean;
}

export default function ProfileAvatar({ 
  name, 
  role, 
  size = 'md',
  editable = false,
  onEdit,
  compact = false
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 sm:w-12 sm:h-12',
    md: 'w-12 h-12 sm:w-16 sm:h-16',
    lg: 'w-16 h-16 sm:w-24 sm:h-24'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4 sm:w-6 sm:h-6',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-12 sm:h-12'
  };

  return (
    <div className={`flex items-center gap-3 ${compact ? 'sm:gap-4' : 'gap-4'}`}>
      <div className={`
        ${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/5 
        flex items-center justify-center relative group
      `}>
        <User className={`${iconSizeClasses[size]} text-primary`} />
        
        {editable && (
          <button 
            onClick={onEdit}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-white text-xs font-medium">Изменить</span>
          </button>
        )}
      </div>
      
      <div>
        <h3 className={`
          font-bold text-foreground
          ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}
        `}>
          {name}
        </h3>
        {role && (
          <p className={`
            text-muted-foreground
            ${compact ? 'text-xs sm:text-sm' : 'text-sm'}
          `}>
            {role}
          </p>
        )}
      </div>
    </div>
  );
}