// app/components/ui/StatCard.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';

interface StatCardProps {
  stat: {
    value: string;
    label: string;
    icon: ReactNode;
  };
  delay?: number;
  animateCount?: boolean;
  compact?: boolean;
}

export default function StatCard({ stat, delay = 0, animateCount = true, compact = false }: StatCardProps) {
  const [countedValue, setCountedValue] = useState('0');
  
  useEffect(() => {
    if (animateCount && stat.value.match(/\d+/)) {
      const num = parseInt(stat.value.replace(/\D/g, ''));
      const duration = 2000;
      const increment = num / (duration / 16);
      let current = 0;
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          current += increment;
          if (current >= num) {
            setCountedValue(stat.value);
            clearInterval(interval);
          } else {
            setCountedValue(`${Math.floor(current)}${stat.value.replace(/\d+/g, '')}`);
          }
        }, 16);
        
        return () => clearInterval(interval);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setCountedValue(stat.value);
    }
  }, [stat.value, delay, animateCount]);

  return (
    <div 
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`
        relative bg-background rounded-lg border border-border 
        hover:border-primary hover:shadow-xl transition-all duration-500 hover:-translate-y-1
        ${compact ? 'p-4 sm:p-6' : 'p-6 sm:p-8'}
      `}>
        <div className={`
          inline-flex rounded-lg bg-secondary mb-3 sm:mb-4 
          group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm
          ${compact ? 'p-2' : 'p-3'}
        `}>
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-500 animate-float">
            {stat.icon}
          </div>
        </div>
        <div className={`
          font-bold text-primary mb-1 sm:mb-2 tabular-nums
          ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}
        `}>
          {countedValue}
        </div>
        <div className={`
          text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300
          ${compact ? 'text-xs sm:text-sm' : 'text-sm'}
        `}>
          {stat.label}
        </div>
      </div>
    </div>
  );
}