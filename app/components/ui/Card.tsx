'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  border?: boolean;
  animateOnHover?: boolean;
}

export default function Card({ 
  children, 
  className,
  hoverEffect = true,
  border = true,
  animateOnHover = true
}: CardProps) {
  const hoverClasses = animateOnHover ? 
    "hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out" : 
    "";
  
  const borderClass = border ? "border border-border" : "";
  
  return (
    <div className={`
      rounded-lg bg-background
      ${borderClass}
      ${hoverEffect ? hoverClasses : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}