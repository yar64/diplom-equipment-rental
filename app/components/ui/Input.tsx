// app/components/ui/Input.tsx
'use client';

import { ReactNode } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  animateOnFocus?: boolean;
  inputSize?: 'sm' | 'default' | 'lg'; // Переименовано с size на inputSize
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  fullWidth = true,
  animateOnFocus = true,
  inputSize = 'default', // Используем inputSize вместо size
  ...props
}: InputProps) {
  const sizeClasses = {
    sm: "py-2 px-3 text-sm h-9",
    default: "py-2.5 px-4 text-base h-11 sm:h-12",
    lg: "py-3 px-4 text-lg h-12 sm:h-14"
  };

  const iconSizeClasses = {
    sm: "left-3",
    default: "left-3 sm:left-4",
    lg: "left-4"
  };
  
  return (
    <div className={`${fullWidth ? "w-full" : ""} input-underline`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`
            absolute top-1/2 transform -translate-y-1/2 text-muted-foreground 
            pointer-events-none transition-colors-smooth input-focus
            ${iconSizeClasses[inputSize]}
          `}>
            {icon}
          </div>
        )}
        
        <input
          className={`
            w-full bg-background border border-input rounded-lg text-foreground
            focus:outline-none transition-smooth
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-muted-foreground/50
            ${sizeClasses[inputSize]}
            ${icon ? `pl-8 sm:pl-10 pr-4` : 'px-4'}
            ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}