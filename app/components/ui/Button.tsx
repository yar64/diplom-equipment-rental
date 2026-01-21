'use client';

import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  hoverEffect?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  fullWidth = false,
  loading = false,
  icon,
  hoverEffect = true,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-sm",
    lg: "h-12 rounded-lg px-8",
    icon: "h-10 w-10",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const hoverClass = hoverEffect ? "hover-lift active-scale btn-hover-effect" : "";
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${hoverClass} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка...
        </>
      ) : (
        <>
          {icon && (
            <span className="mr-2 transition-transform-smooth icon-hover">
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </button>
  );
}