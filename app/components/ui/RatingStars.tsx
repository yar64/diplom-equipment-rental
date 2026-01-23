// app/components/ui/RatingStars.tsx
'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  showValue?: boolean;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export default function RatingStars({ 
  rating, 
  showValue = false, 
  animate = true, 
  size = 'md',
  compact = false
}: RatingStarsProps) {
  const starSizeClasses = {
    sm: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
    md: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    lg: 'w-4 h-4 sm:w-5 sm:h-5'
  };

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`
            ${starSizeClasses[size]}
            ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}
            ${animate ? 'transition-all duration-300 hover:scale-125 hover:rotate-12' : ''}
          `}
          style={{
            animationDelay: animate ? `${i * 100}ms` : '0ms'
          }}
        />
      ))}
      {showValue && (
        <span className={`
          text-muted-foreground transition-colors duration-300 group-hover:text-foreground
          ${compact ? 'text-xs ml-1' : 'text-sm ml-2'}
        `}>
          {rating}
        </span>
      )}
    </div>
  );
}