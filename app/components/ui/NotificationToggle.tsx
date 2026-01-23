// app/components/ui/NotificationToggle.tsx
'use client';

import { useState } from 'react';

interface NotificationToggleProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  compact?: boolean;
}

export default function NotificationToggle({ 
  id, 
  label, 
  description, 
  defaultChecked = false,
  compact = false
}: NotificationToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className={`
      flex items-center justify-between rounded-lg hover:border-primary/50 
      transition-colors-smooth border
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className="flex-1 pr-4">
        <p className={`font-medium text-foreground ${compact ? 'text-sm' : 'text-base'}`}>
          {label}
        </p>
        <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input 
          type="checkbox" 
          id={id}
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className={`
          bg-muted rounded-full peer peer-checked:bg-primary transition-colors 
          duration-300 relative
          ${compact ? 'w-10 h-5' : 'w-12 h-6'}
        `}>
          <div className={`
            absolute top-1/2 -translate-y-1/2 bg-white rounded-full 
            transition-transform duration-300 
            ${checked ? (compact ? 'translate-x-6' : 'translate-x-7') : 'translate-x-1'}
            ${compact ? 'w-3 h-3' : 'w-4 h-4'}
          `} />
        </div>
      </label>
    </div>
  );
}