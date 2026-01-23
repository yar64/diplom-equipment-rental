// app/components/ui/Select.tsx
'use client';

import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  selectSize?: 'sm' | 'default' | 'lg';
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
  className = '',
  disabled = false,
  label,
  error,
  icon,
  selectSize = 'default'
}: SelectProps) {
  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    default: "py-2.5 px-4 text-base",
    lg: "py-3 px-4 text-lg"
  };

  const iconSizeClasses = {
    sm: "left-3",
    default: "left-3 sm:left-4",
    lg: "left-4"
  };
  
  return (
    <div className={`w-full input-underline ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`
            absolute top-1/2 transform -translate-y-1/2 text-muted-foreground 
            pointer-events-none transition-colors-smooth icon-focus
            ${iconSizeClasses[selectSize]}
          `}>
            {icon}
          </div>
        )}
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none bg-background border border-input rounded-lg text-foreground
            focus:outline-none transition-smooth
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-muted-foreground/50
            ${sizeClasses[selectSize]}
            ${icon ? `pl-8 sm:pl-10 pr-10` : 'pr-10'}
            ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-background text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground transition-transform-smooth icon-focus">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}