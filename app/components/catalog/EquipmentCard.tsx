// app/components/ui/EquipmentCard.tsx
'use client';

import Card, { CardContent } from '../ui/Card';
import RatingStars from '../ui/RatingStars';
import Button from '../ui/Button';
import { PopularEquipment } from '../shared/types';

interface EquipmentCardProps {
  equipment: PopularEquipment;
  onRent?: (id: number) => void;
  delay?: number;
  compact?: boolean;
}

export default function EquipmentCard({ equipment, onRent, delay = 0, compact = false }: EquipmentCardProps) {
  return (
    <div className="relative">
      <Card className="group h-full flex flex-col relative overflow-hidden"> {/* Добавил overflow-hidden */}
        {equipment.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`
              px-2 py-1 bg-primary text-primary-foreground text-xs
              font-medium rounded-full shadow-md
            `}>
              {equipment.badge}
            </span>
          </div>
        )}
        
        {/* Изображение */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
          <div className="absolute bottom-2 right-2 z-10">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              {equipment.category}
            </span>
          </div>
        </div>
        
        <CardContent className="flex-1 flex flex-col">
          <h3 className={`
            font-semibold text-gray-900 dark:text-gray-100 mb-2
            ${compact ? 'text-sm' : 'text-base'}
            line-clamp-2
          `}>
            {equipment.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <RatingStars rating={equipment.rating} showValue={!compact} />
            {!compact && (
              <span className="text-sm text-gray-500">
                ({equipment.reviews})
              </span>
            )}
          </div>
          
          <div className="mb-4">
            <span className={`
              font-bold text-gray-900 dark:text-gray-100
              ${compact ? 'text-lg' : 'text-xl'}
            `}>
              {equipment.price}₽
            </span>
            <span className="text-gray-500 text-sm">/{equipment.period}</span>
          </div>
          
          <div className="mt-auto">
            <Button 
              variant="primary" 
              fullWidth
              size={compact ? "sm" : "default"}
              onClick={() => onRent?.(equipment.id)}
              className="hover:scale-105 transition-transform"
            >
              Арендовать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}