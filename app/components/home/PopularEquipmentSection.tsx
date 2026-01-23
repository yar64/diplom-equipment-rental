// app/components/home/PopularEquipmentSection.tsx
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import EquipmentCard from '../ui/EquipmentCard';
import Button from '../ui/Button';

const popularEquipment = [
  { 
    id: 1, 
    name: 'Профессиональный микшерный пульт Yamaha CL5', 
    category: 'Аудио',
    price: '4500', 
    period: 'сутки', 
    rating: 4.8, 
    reviews: 124, 
    badge: 'Хит сезона',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop',
    available: true,
    specs: { 
      channels: '32', 
      connectivity: 'Dante, AES/EBU',
      power: '1500W'
    },
    tags: ['Профессиональное', 'Концертное'],
    deliveryAvailable: true,
    setupIncluded: true,
    featured: true
  },
  { 
    id: 2, 
    name: 'LED панель 55" 4K Samsung QLED', 
    category: 'Видео',
    price: '12000', 
    period: 'сутки', 
    rating: 4.9, 
    reviews: 89, 
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    available: true,
    specs: { 
      resolution: '4K UHD', 
      connectivity: 'HDMI, DisplayPort',
      size: '55"'
    },
    tags: ['4K', 'HDR'],
    deliveryAvailable: true,
    setupIncluded: true,
    featured: true
  },
  { 
    id: 3, 
    name: 'Прожектор Moving Head Beam 400W', 
    category: 'Свет',
    price: '6500', 
    period: 'сутки', 
    rating: 4.7, 
    reviews: 67, 
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop',
    available: true,
    specs: { 
      power: '400W', 
      beamAngle: '5°',
      control: 'DMX'
    },
    tags: ['Сценическое', 'Эффекты'],
    deliveryAvailable: true,
    setupIncluded: false,
    featured: true
  },
  { 
    id: 4, 
    name: 'Акустическая система JBL SRX 2000W', 
    category: 'Аудио',
    price: '2200', 
    period: 'сутки', 
    rating: 4.9, 
    reviews: 156, 
    badge: 'Лучший выбор',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop',
    available: true,
    specs: { 
      power: '2000W', 
      frequency: '35Hz-20kHz',
      sensitivity: '98dB'
    },
    tags: ['Концертная', 'Мощная'],
    deliveryAvailable: true,
    setupIncluded: true,
    featured: true
  },
];

export default function PopularEquipmentSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-secondary w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 lg:mb-16 gap-4 md:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4 border border-border">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium text-muted-foreground">Популярные позиции</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Часто выбирают <span className="text-primary">клиенты</span>
            </h2>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
              Проверенное оборудование для важных мероприятий
            </p>
          </div>
          <Link href="/catalog" className="mt-4 sm:mt-0">
            <Button 
              variant="primary" 
              icon={<ChevronRight className="w-3 h-3 md:w-4 md:h-4" />}
              className="text-sm md:text-base"
            >
              Весь каталог
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {popularEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      </div>
    </section>
  );
}