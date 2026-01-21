'use client';

import Card, { CardContent } from './Card';
import { Feature } from '../shared/types';

interface FeatureCardProps {
  feature: Feature;
  delay?: number;
}

export default function FeatureCard({ feature, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="group hover:shadow-xl transition-all duration-500">
        <CardContent>
          <div className={`inline-flex p-3 rounded-lg ${feature.accent} mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out shadow-sm`}>
            <div className="animate-float">
              {feature.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}