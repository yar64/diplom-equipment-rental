// app/catalog/components/SearchResults.tsx
'use client';

import { Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import EquipmentCard from '../../components/ui/EquipmentCard';
import { PopularEquipment } from '../shared/types';

interface SearchResultsProps {
  isLoading: boolean;
  filteredEquipment: PopularEquipment[];
  searchQuery: string;
  activeFilters: string[];
  onClearFilters: () => void;
  onRent: (id: number) => void;
  onSelectAllCategories: () => void;
}

export default function SearchResults({
  isLoading,
  filteredEquipment,
  searchQuery,
  activeFilters,
  onClearFilters,
  onRent,
  onSelectAllCategories,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-4/3 bg-secondary rounded-xl mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="h-8 bg-secondary rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredEquipment.length === 0) {
    return (
      <Card className="text-center py-16">
        <CardContent>
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Ничего не найдено
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Попробуйте изменить параметры поиска или выберите другую категорию
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onClearFilters} className="gap-2">
              Сбросить фильтры
            </Button>
            <Button variant="outline" onClick={onSelectAllCategories}>
              Все категории
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEquipment.map((item, index) => (
        <EquipmentCard
          key={item.id}
          equipment={item}
          onRent={onRent}
          delay={index * 50}
        />
      ))}
    </div>
  );
}