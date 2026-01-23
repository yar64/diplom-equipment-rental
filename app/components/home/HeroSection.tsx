// app/components/home/HeroSection.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Sparkles, Award, Users, CheckCircle } from 'lucide-react';
import EquipmentSearchForm from '../ui/SearchForm';
import StatCard from '../ui/StatCard';

const statistics = [
  { 
    value: '850+', 
    label: 'Единиц оборудования', 
    icon: <Award className="w-5 h-5 md:w-6 md:h-6" />
  },
  { 
    value: '2 400+', 
    label: 'Довольных клиентов', 
    icon: <Users className="w-5 h-5 md:w-6 md:h-6" />
  },
  { 
    value: '98%', 
    label: 'Положительных отзывов', 
    icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
  }
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Search:', { searchQuery, selectedCategory, selectedPrice });
      
      // Здесь будет реальный поиск
      // const response = await searchEquipment({ searchQuery, selectedCategory, selectedPrice });
      
      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 z-[-1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 z-[-1]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-secondary/80 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground">
                Профессиональная аренда с 2018 года
              </span>
            </div>
            
            {/* Заголовок */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6">
              <span className="text-foreground block mb-1 sm:mb-2">Создаем</span>
              <span className="block">
                <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text animate-gradient-x">
                  незабываемые
                </span>
                <span className="text-foreground"> мероприятия</span>
              </span>
            </h1>
            
            {/* Описание */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4 sm:px-0">
              Всё профессиональное оборудование для ваших ивентов: 
              от аудиосистем концертного уровня до сложных световых инсталляций
            </p>

            {/* Форма поиска */}
            <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 mb-8 sm:mb-12 md:mb-16">
              <EquipmentSearchForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPrice={selectedPrice}
                setSelectedPrice={setSelectedPrice}
                onSubmit={handleSearch}
                loading={isLoading}
                className="shadow-lg sm:shadow-xl hover:shadow-2xl transition-shadow duration-500"
              />
              
              {/* Быстрые фильтры */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setSearchQuery('звук')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-secondary/50 hover:bg-secondary rounded-lg transition-colors duration-300"
                >
                  Звуковое оборудование
                </button>
                <button
                  onClick={() => setSearchQuery('свет')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-secondary/50 hover:bg-secondary rounded-lg transition-colors duration-300"
                >
                  Световое оборудование
                </button>
                <button
                  onClick={() => setSearchQuery('видео')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-secondary/50 hover:bg-secondary rounded-lg transition-colors duration-300"
                >
                  Видео оборудование
                </button>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto">
              {statistics.map((stat, idx) => (
                <div 
                  key={idx}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <StatCard 
                    stat={stat} 
                    delay={idx * 150}
                    animateCount={true}
                  />
                </div>
              ))}
            </div>

            {/* Дополнительная информация для мобильных */}
            <div className="sm:hidden mt-8 pt-6 border-t border-border/50">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Бесплатная доставка от 10 000₽</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Гарантия на всё оборудование</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Круглосуточная поддержка</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-10 left-5 w-20 h-20 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-5 w-24 h-24 sm:w-40 sm:h-40 bg-secondary/5 rounded-full blur-xl animate-pulse-slow delay-1000" />
    </section>
  );
}