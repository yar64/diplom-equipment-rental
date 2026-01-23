// app/components/ui/Card.tsx
'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  border?: boolean;
  animateOnHover?: boolean;
  compact?: boolean; // Новый проп для мобильной компактности
}

export default function Card({ 
  children, 
  className,
  hoverEffect = true,
  border = true,
  animateOnHover = true,
  compact = false
}: CardProps) {
  const hoverClasses = animateOnHover ? 
    "hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out sm:hover:-translate-y-1" : 
    "";
  
  const borderClass = border ? "border border-border" : "";
  const compactClass = compact ? "p-4 sm:p-6" : "";
  
  return (
    <div className={`
      rounded-lg bg-background
      ${borderClass}
      ${hoverEffect ? hoverClasses : ''}
      ${compactClass}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export function CardContent({ children, className = '', compact = false }: CardContentProps) {
  return (
    <div className={`${compact ? 'p-4 sm:p-6' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}