'use client';

import { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  animateOnFocus?: boolean;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  fullWidth = true,
  animateOnFocus = true,
  ...props
}: InputProps) {
  // Убираем animateOnFocus из props, чтобы он не передавался в DOM элемент
  const inputProps = { ...props };
  
  return (
    <div className={`${fullWidth ? "w-full" : ""} input-underline`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors-smooth input-focus">
            {icon}
          </div>
        )}
        
        <input
          className={`
            w-full bg-background border border-input rounded-lg py-3 px-4 text-foreground
            focus:outline-none transition-smooth
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-muted-foreground/50
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            ${className}
          `}
          {...inputProps} // Используем очищенные props
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}