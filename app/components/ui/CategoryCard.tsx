'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Card, { CardContent } from './Card';
import { EquipmentCategory } from '../shared/types';

interface CategoryCardProps {
  category: EquipmentCategory;
  delay?: number;
}

export default function CategoryCard({ category, delay = 0 }: CategoryCardProps) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={`/catalog?category=${encodeURIComponent(category.name)}`} className="group block">
        <Card className="hover:shadow-xl transition-all duration-500">
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-lg blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-secondary group-hover:bg-accent transition-all duration-300 group-hover:scale-110">
                    <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {category.icon}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {category.count} позиций
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-once"></span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}