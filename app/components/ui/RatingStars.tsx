'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  showValue?: boolean;
  animate?: boolean;
}

export default function RatingStars({ rating, showValue = false, animate = true }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`
            w-4 h-4
            ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}
            ${animate ? 'transition-all duration-300 hover:scale-125 hover:rotate-12' : ''}
          `}
          style={{
            animationDelay: animate ? `${i * 100}ms` : '0ms'
          }}
        />
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {rating}
        </span>
      )}
    </div>
  );
}