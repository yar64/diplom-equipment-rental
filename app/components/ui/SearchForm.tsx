// app/components/ui/SearchForm.tsx
'use client';

import { FormEvent } from 'react';
import { Search, Tag, DollarSign } from 'lucide-react';
import Input from './Input';
import Button from './Button';

interface Category {
  id: number;
  name: string;
}

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPrice: string;
  setSelectedPrice: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  categories?: Category[];
  className?: string;
  loading?: boolean;
  compact?: boolean;
}

const priceOptions = [
  { value: '', label: 'Любая цена' },
  { value: '0-1000', label: 'до 1 000₽/день' },
  { value: '1000-3000', label: '1 000-3 000₽/день' },
  { value: '3000-5000', label: '3 000-5 000₽/день' },
  { value: '5000+', label: 'от 5 000₽/день' },
];

// Временный компонент Select (если его нет)
const SimpleSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  className = '',
  icon
}: any) => (
  <div className={`relative ${className}`}>
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        {icon}
      </div>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full rounded-lg border border-input bg-background px-3 py-2 text-sm
        ${icon ? 'pl-10' : 'pl-3'}
        focus:outline-none focus:ring-2 focus:ring-ring
      `}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default function EquipmentSearchForm({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  onSubmit,
  categories = [],
  className = '',
  loading = false,
  compact = false
}: SearchFormProps) {
  const categoryOptions = [
    { value: '', label: 'Все категории' },
    ...categories.map(cat => ({
      value: cat.name,
      label: cat.name
    }))
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className={className}>
      <div className={`
        bg-background rounded-lg border border-border shadow-sm
        ${compact ? 'p-4' : 'p-6'}
      `}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Строка поиска */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={compact ? "Поиск..." : "Найдите оборудование..."}
                icon={<Search className="w-4 h-4" />}
                className={`${compact ? 'text-sm' : 'text-base'}`}
              />
            </div>
            <Button
              type="submit"
              size={compact ? "sm" : "default"}
              loading={loading}
              className={`whitespace-nowrap ${compact ? 'sm:w-auto w-full' : ''}`}
              hoverEffect
            >
              {compact ? (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Найти
                </>
              ) : (
                'Найти оборудование'
              )}
            </Button>
          </div>

          {/* Фильтры */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SimpleSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="Все категории"
              icon={<Tag className="w-4 h-4" />}
              className="flex-1"
            />

            <SimpleSelect
              value={selectedPrice}
              onChange={setSelectedPrice}
              options={priceOptions}
              placeholder="Любая цена"
              icon={<DollarSign className="w-4 h-4" />}
              className="flex-1"
            />
          </div>

          {/* Дополнительная информация */}
          {!compact && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  Популярное: колонки, микрофон, проектор
                </div>
                <div className="text-sm text-muted-foreground">
                  850+ позиций в наличии
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}