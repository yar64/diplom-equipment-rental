// app/components/home/HeroSection.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Sparkles, Award, Users, CheckCircle } from 'lucide-react';
import SearchForm from '../ui/SearchForm';
import StatCard from '../ui/StatCard';

// Локальная константа statistics
const statistics = [
  { 
    value: '850+', 
    label: 'Единиц оборудования', 
    icon: <Award className="w-6 h-6" />
  },
  { 
    value: '2 400+', 
    label: 'Довольных клиентов', 
    icon: <Users className="w-6 h-6" />
  },
  { 
    value: '98%', 
    label: 'Положительных отзывов', 
    icon: <CheckCircle className="w-6 h-6" />
  }
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search:', { searchQuery, selectedCategory, selectedPrice });
  };

  return (
    <main className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 border border-border">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Профессиональная аренда с 2018 года</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Создаем</span>
            <span className="block mt-2">
              <span className="text-primary">незабываемые</span>
              <span className="text-foreground"> мероприятия</span>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Всё профессиональное оборудование для ваших ивентов: 
            от аудиосистем концертного уровня до сложных световых инсталляций
          </p>

          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            onSubmit={handleSearch}
          />

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {statistics.map((stat, idx) => (
              <StatCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}