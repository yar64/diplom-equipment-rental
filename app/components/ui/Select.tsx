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
  icon
}: SelectProps) {
  return (
    <div className={`w-full input-underline ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors-smooth icon-focus">
            {icon}
          </div>
        )}
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none bg-background border border-input rounded-lg py-3 px-4 text-foreground
            focus:outline-none transition-smooth
            disabled:cursor-not-allowed disabled:opacity-50
            hover:border-muted-foreground/50
            ${icon ? 'pl-10 pr-10' : 'pr-10'}
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