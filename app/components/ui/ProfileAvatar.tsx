// app/components/ui/ProfileAvatar.tsx
'use client';

import { User } from 'lucide-react';

interface ProfileAvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onEdit?: () => void;
}

export default function ProfileAvatar({ 
  name, 
  role, 
  size = 'md',
  editable = false,
  onEdit 
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative group`}>
        <User className={`${size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} text-primary`} />
        
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
        <h3 className="font-bold text-lg">{name}</h3>
        {role && (
          <p className="text-sm text-muted-foreground">{role}</p>
        )}
      </div>
    </div>
  );
}