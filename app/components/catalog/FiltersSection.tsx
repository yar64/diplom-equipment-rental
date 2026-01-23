// app/catalog/components/FiltersSection.tsx
'use client';

import { useState, useRef } from 'react';
import { Search, Filter, ChevronDown, Truck, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import { Category, SortOption } from '../shared/types';

interface FiltersSectionProps {
  categories: Category[];
  sortOptions: SortOption[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onQuickFilter: (filter: string) => void;
}

export default function FiltersSection({
  categories,
  sortOptions,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  showFilters,
  onToggleFilters,
  onQuickFilter,
}: FiltersSectionProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handlePriceChange = (index: number, value: string) => {
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = parseInt(value);
    onPriceRangeChange(newPriceRange);
  };

  return (
    <section className="mb-12">
      <Card className="backdrop-blur-sm bg-background/60 border-border/50 shadow-lg">
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Поиск */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Найти оборудование, характеристики или категории..."
                  className="w-full pl-12 pr-4 py-4 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/70"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Сортировка */}
            <div>
              <Select
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions}
                placeholder="Сортировка"
                icon={<Filter className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Категории */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Категории оборудования</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFilters}
                className="gap-2 hover-lift"
              >
                <Filter className="w-4 h-4 transition-transform" />
                {showFilters ? 'Скрыть фильтры' : 'Все фильтры'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "primary" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange(category.id)}
                    className="gap-2 hover-lift"
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    {category.name}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-background/20' : 'bg-secondary'}`}>
                      {category.count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && (
            <div className="mt-6 p-6 border rounded-xl bg-secondary/10 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Диапазон цен: <span className="text-primary font-semibold">{priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽</span>
                  </label>
                  <div className="relative pt-6 pb-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-secondary rounded-full -translate-y-1/2" />
                    <div 
                      className="absolute top-1/2 h-1.5 bg-linear-to-r from-primary/60 to-primary rounded-full -translate-y-1/2"
                      style={{
                        left: `${(priceRange[0] / 20000) * 100}%`,
                        right: `${100 - (priceRange[1] / 20000) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="absolute top-1/2 left-0 right-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="absolute top-1/2 left-0 right-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Дополнительные опции
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 hover-lift"
                      onClick={() => onQuickFilter('delivery')}
                    >
                      <Truck className="w-4 h-4" />
                      Доставка
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 hover-lift"
                      onClick={() => onQuickFilter('available')}
                    >
                      <Calendar className="w-4 h-4" />
                      Установка
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}