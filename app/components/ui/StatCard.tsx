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
}

export default function StatCard({ stat, delay = 0, animateCount = true }: StatCardProps) {
  const [countedValue, setCountedValue] = useState('0');
  
  useEffect(() => {
    // Анимация счетчика для чисел
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
      <div className="relative bg-background rounded-lg p-8 border border-border hover:border-primary hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
        <div className="inline-flex p-3 rounded-lg bg-secondary mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm">
          <div className="text-muted-foreground group-hover:text-primary transition-colors duration-500 animate-float">
            {stat.icon}
          </div>
        </div>
        <div className="text-4xl font-bold text-primary mb-2 tabular-nums">
          {countedValue}
        </div>
        <div className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
          {stat.label}
        </div>
      </div>
    </div>
  );
}