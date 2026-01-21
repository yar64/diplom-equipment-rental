'use client';

import { FormEvent } from 'react';
import { Search, Tag, DollarSign } from 'lucide-react';
import Input from './Input';
import Select from './Select';
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
}

const priceOptions = [
  { value: '', label: 'Любая цена' },
  { value: '0-1000', label: 'до 1 000₽/день' },
  { value: '1000-3000', label: '1 000-3 000₽/день' },
  { value: '3000-5000', label: '3 000-5 000₽/день' },
  { value: '5000+', label: 'от 5 000₽/день' },
];

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  onSubmit,
  categories = [],
  className = '',
  loading = false
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
    <div className={`relative animate-fade-in-up ${className}`}>
      <div className="relative bg-background rounded-lg border border-border p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-500 group">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 group">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Например: микшерный пульт, LED панель, прожектор..."
                icon={<Search className="w-5 h-5 group-focus-within:scale-110 transition-transform duration-300" />}
                className="text-base h-12 focus:shadow-lg"
                animateOnFocus
              />
            </div>
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="whitespace-nowrap h-12 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              hoverEffect
            >
              Найти оборудование
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="Все категории"
              icon={<Tag className="w-4 h-4 group-focus-within:scale-110 transition-transform duration-300" />}
              className="group hover:shadow-sm transition-shadow duration-300"
            />

            <Select
              value={selectedPrice}
              onChange={setSelectedPrice}
              options={priceOptions}
              placeholder="Любая цена"
              icon={<DollarSign className="w-4 h-4 group-focus-within:scale-110 transition-transform duration-300" />}
              className="group hover:shadow-sm transition-shadow duration-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
}