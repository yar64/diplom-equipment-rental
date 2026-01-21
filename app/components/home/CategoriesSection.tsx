import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { equipmentCategories } from '../shared/constants';
import CategoryCard from '../ui/CategoryCard';

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4 border border-border">
            <span className="text-sm font-medium text-muted-foreground">Выберите категорию</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Оборудование <span className="text-primary">профессионального</span> уровня
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            От элитных аудиосистем до инновационных световых решений
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}