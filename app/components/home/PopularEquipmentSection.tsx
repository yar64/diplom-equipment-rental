import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { popularEquipment } from '../shared/constants';
import EquipmentCard from '../ui/EquipmentCard';
import Button from '../ui/Button';

export default function PopularEquipmentSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4 border border-border">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Популярные позиции</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Часто выбирают <span className="text-primary">клиенты</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Проверенное оборудование для важных мероприятий</p>
          </div>
          <Link href="/catalog">
            <Button 
              variant="primary" 
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Весь каталог
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      </div>
    </section>
  );
}