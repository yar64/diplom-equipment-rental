// app/components/auth/SocialAuth.tsx
'use client';

import { Github, Chrome, Facebook } from 'lucide-react';

interface SocialAuthProps {
  mode: 'login' | 'register';
  compact?: boolean;
}

export default function SocialAuth({ mode, compact = false }: SocialAuthProps) {
  const socialButtons = [
    { 
      id: 'google', 
      label: 'Google', 
      icon: <Chrome className="w-5 h-5" />, 
      color: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600' 
    },
    { 
      id: 'github', 
      label: 'GitHub', 
      icon: <Github className="w-5 h-5" />, 
      color: 'hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900' 
    },
    { 
      id: 'facebook', 
      label: 'Facebook', 
      icon: <Facebook className="w-5 h-5" />, 
      color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600' 
    },
  ];

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">
              Или через
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {socialButtons.map((social) => (
            <button
              key={social.id}
              type="button"
              className={`
                flex flex-col items-center gap-1 p-2 border border-border rounded-lg 
                bg-background transition-all duration-300 text-xs
                hover:shadow-sm active:scale-95 ${social.color}
              `}
            >
              {social.icon}
              <span>{social.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Или продолжить через
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {socialButtons.map((social) => (
          <button
            key={social.id}
            type="button"
            className={`
              flex flex-col items-center gap-2 p-3 border border-border rounded-lg 
              bg-background transition-all duration-300 cursor-pointer
              hover:shadow-md hover:-translate-y-0.5 active:scale-95
              ${social.color}
            `}
            onClick={() => console.log(`${mode} with ${social.id}`)}
          >
            {social.icon}
            <span className="text-xs font-medium">{social.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}