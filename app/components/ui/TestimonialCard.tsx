'use client';

import Card, { CardContent } from './Card';
import RatingStars from './RatingStars';
import { Testimonial } from '../shared/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: number;
}

export default function TestimonialCard({ testimonial, delay = 0 }: TestimonialCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="group relative hover:shadow-xl transition-all duration-500">
        <div className="absolute -top-4 left-8 animate-scale-in">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm hover:scale-110 transition-transform duration-300">
            {testimonial.initials}
          </div>
        </div>
        <CardContent className="pt-12">
          <div className="mb-6">
            <RatingStars rating={testimonial.rating} animate />
          </div>
          <blockquote className="text-muted-foreground mb-8 group-hover:text-foreground transition-colors duration-300 italic">
            &ldquo;{testimonial.text}&rdquo;
          </blockquote>
          <div>
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {testimonial.role}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}