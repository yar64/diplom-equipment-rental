// app/components/ui/CategoryCard.tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card, { CardContent } from './Card';
import { EquipmentCategory } from '../shared/types';

interface CategoryCardProps {
  category: EquipmentCategory;
  delay?: number;
  compact?: boolean;
}

export default function CategoryCard({ category, delay = 0, compact = false }: CategoryCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={`/catalog?category=${encodeURIComponent(category.name)}`} className="group block">
        <Card className="hover:shadow-xl transition-all duration-500" compact={compact}>
          <CardContent compact={compact}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-lg blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className={`
                    relative flex items-center justify-center rounded-lg bg-secondary 
                    group-hover:bg-accent transition-all duration-300 group-hover:scale-110
                    ${compact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12'}
                  `}>
                    <div className={`
                      text-muted-foreground group-hover:text-foreground transition-colors duration-300
                      ${compact ? 'scale-90 sm:scale-100' : ''}
                    `}>
                      {category.icon}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={`
                    font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary 
                    transition-colors duration-300
                    ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}
                  `}>
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-muted-foreground group-hover:text-foreground transition-colors duration-300
                      ${compact ? 'text-xs sm:text-sm' : 'text-sm'}
                    `}>
                      {category.count} позиций
                    </span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-once"></span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted group-hover:text-foreground group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}