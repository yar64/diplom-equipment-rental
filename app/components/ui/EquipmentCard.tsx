'use client';

import Card, { CardContent } from './Card';
import RatingStars from './RatingStars';
import Button from './Button';
import { PopularEquipment } from '../shared/types';

interface EquipmentCardProps {
  equipment: PopularEquipment;
  onRent?: (id: number) => void;
  delay?: number;
}

export default function EquipmentCard({ equipment, onRent, delay = 0 }: EquipmentCardProps) {
  return (
    <div 
      className="animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="group relative overflow-hidden hover:shadow-xl">
        {equipment.badge && (
          <div className="absolute top-4 left-4 z-10 animate-pulse-once">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-sm">
              {equipment.badge}
            </span>
          </div>
        )}
        <div className="aspect-[4/3] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/30 to-accent/40 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full shadow-sm">
              {equipment.category}
            </span>
          </div>
        </div>
        <CardContent>
          <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {equipment.name}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <RatingStars rating={equipment.rating} showValue />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              ({equipment.reviews})
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-6">
            <div className="group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-bold text-foreground">{equipment.price}₽</span>
              <span className="text-muted-foreground">/{equipment.period}</span>
            </div>
          </div>
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => onRent?.(equipment.id)}
            className="hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Арендовать
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}