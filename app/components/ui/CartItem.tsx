'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, Calendar, Package } from 'lucide-react';
import Button from './Button';
import Card, { CardContent } from './Card';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    category: string;
    dailyPrice: number;
    quantity: number;
    rentalDates: {
      start: string;
      end: string;
      days: number;
    };
    totalPrice: number;
    image?: string;
    inStock: boolean;
  };
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onDatesChange?: (id: string, dates: { start: string; end: string }) => void;
  compact?: boolean;
}

export default function CartItem({ 
  item, 
  onRemove, 
  onQuantityChange,
  compact = false 
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, item.quantity + change);
    onQuantityChange(item.id, newQuantity);
  };

  return (
    <Card className={`
      overflow-hidden transition-all duration-300
      ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      ${compact ? 'p-3 sm:p-4' : ''}
    `}>
      <CardContent className={compact ? 'p-0' : ''}>
        <div className={`
          flex flex-col sm:flex-row gap-4
          ${compact ? 'p-0' : 'p-2'}
        `}>
          {/* Изображение */}
          <div className={`
            relative flex-shrink-0
            ${compact ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-32 sm:h-32'}
            bg-gradient-to-br from-muted to-muted/50 rounded-lg
            flex items-center justify-center overflow-hidden
          `}>
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            )}
            {item.inStock ? (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                ✓
              </span>
            ) : (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                !
              </span>
            )}
          </div>

          {/* Контент */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className={`
                  font-semibold text-foreground
                  ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}
                  line-clamp-2
                `}>
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.category}
                </p>
              </div>

              {/* Стоимость */}
              <div className="text-right">
                <div className={`
                  font-bold text-foreground
                  ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}
                `}>
                  {item.totalPrice.toLocaleString()} ₽
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.dailyPrice.toLocaleString()} ₽/сутки
                </div>
              </div>
            </div>

            {/* Управление */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Количество */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Количество
                </label>
                <div className="flex items-center gap-2 max-w-[140px]">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={item.quantity <= 1}
                    className="h-9 w-9"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <span className="text-xs text-muted-foreground block">шт.</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="h-9 w-9"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Даты */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Даты аренды
                </label>
                <div className="flex items-center gap-2 p-2.5 border rounded-lg bg-muted/20">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {item.rentalDates.start} - {item.rentalDates.end}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {item.rentalDates.days} дней
                  </span>
                </div>
              </div>

              {/* Удаление */}
              <div className="sm:flex sm:items-end sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-destructive hover:bg-destructive/10 h-9 px-3"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}