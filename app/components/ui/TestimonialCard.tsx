// app/components/ui/TestimonialCard.tsx
'use client';

import Card, { CardContent } from './Card';
import RatingStars from './RatingStars';
import { Testimonial } from '../shared/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
  compact?: boolean;
}

export default function TestimonialCard({ testimonial, delay = 0, compact = false }: TestimonialCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="group relative hover:shadow-xl transition-all duration-500" compact={compact}>
        <div className={`absolute ${compact ? '-top-3 left-4' : '-top-4 left-8'} animate-scale-in`}>
          <div className={`
            rounded-full bg-primary text-primary-foreground flex items-center justify-center 
            font-bold shadow-sm hover:scale-110 transition-transform duration-300
            ${compact ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg'}
          `}>
            {testimonial.initials}
          </div>
        </div>
        <CardContent className={compact ? 'pt-10' : 'pt-12'} compact={compact}>
          <div className="mb-4 sm:mb-6">
            <RatingStars rating={testimonial.rating} animate={!compact} size={compact ? "sm" : "md"} />
          </div>
          <blockquote className={`
            text-muted-foreground mb-6 group-hover:text-foreground transition-colors duration-300 italic
            ${compact ? 'text-xs sm:text-sm' : 'text-sm'}
          `}>
            &ldquo;{testimonial.text}&rdquo;
          </blockquote>
          <div>
            <div className={`
              font-semibold text-foreground group-hover:text-primary transition-colors duration-300
              ${compact ? 'text-sm' : 'text-base'}
            `}>
              {testimonial.name}
            </div>
            <div className={`
              text-muted-foreground group-hover:text-foreground transition-colors duration-300
              ${compact ? 'text-xs' : 'text-sm'}
            `}>
              {testimonial.role}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}