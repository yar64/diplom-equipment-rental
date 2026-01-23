// app/components/ui/FeatureCard.tsx
'use client';

import Card, { CardContent } from './Card';
import { Feature } from '../shared/types';

interface FeatureCardProps {
  feature: Feature;
  delay?: number;
  compact?: boolean;
}

export default function FeatureCard({ feature, delay = 0, compact = false }: FeatureCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="group hover:shadow-xl transition-all duration-500" compact={compact}>
        <CardContent compact={compact}>
          <div className={`
            inline-flex rounded-lg ${feature.accent} mb-4 sm:mb-6 
            group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out shadow-sm
            ${compact ? 'p-2' : 'p-3'}
          `}>
            <div className="animate-float">
              {feature.icon}
            </div>
          </div>
          <h3 className={`
            font-semibold text-foreground mb-3 sm:mb-4 group-hover:text-primary 
            transition-colors duration-300
            ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}
          `}>
            {feature.title}
          </h3>
          <p className={`
            text-muted-foreground group-hover:text-foreground transition-colors duration-300
            ${compact ? 'text-xs sm:text-sm' : 'text-sm'}
          `}>
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}