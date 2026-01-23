// app/catalog/components/QuickFilters.tsx
'use client';

import { Sparkles, Clock, Truck, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

interface QuickFiltersProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export default function QuickFilters({ activeFilters, onFilterToggle }: QuickFiltersProps) {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant={activeFilters.includes('featured') ? 'primary' : 'outline'}
          onClick={() => onFilterToggle('featured')}
          className="gap-2 hover-lift"
        >
          <Sparkles className="w-4 h-4" />
          Рекомендуемые
          {activeFilters.includes('featured') && <Check className="w-4 h-4" />}
        </Button>
        <Button
          variant={activeFilters.includes('available') ? 'primary' : 'outline'}
          onClick={() => onFilterToggle('available')}
          className="gap-2 hover-lift"
        >
          <Clock className="w-4 h-4" />
          Доступно сейчас
          {activeFilters.includes('available') && <Check className="w-4 h-4" />}
        </Button>
        <Button
          variant={activeFilters.includes('delivery') ? 'primary' : 'outline'}
          onClick={() => onFilterToggle('delivery')}
          className="gap-2 hover-lift"
        >
          <Truck className="w-4 h-4" />
          С доставкой
          {activeFilters.includes('delivery') && <Check className="w-4 h-4" />}
        </Button>
      </div>
    </section>
  );
}