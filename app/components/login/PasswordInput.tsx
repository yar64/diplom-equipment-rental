// app/components/auth/PasswordInput.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder = 'Введите пароль',
  required = true
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Key className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 bg-background border rounded-lg
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-300
            ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-input hover:border-primary/50'}
          `}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md hover:bg-accent transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
}