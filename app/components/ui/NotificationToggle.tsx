// app/components/ui/NotificationToggle.tsx
'use client';

import { useState } from 'react';

interface NotificationToggleProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

export default function NotificationToggle({ 
  id, 
  label, 
  description, 
  defaultChecked = false 
}: NotificationToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors-smooth">
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id}
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors duration-300 relative">
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
        </div>
      </label>
    </div>
  );
}