// app/catalog/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Background from '../components/catalog/Background';
import HeroSection from '../components/catalog/HeroSection';
import QuickFilters from '../components/catalog/QuickFilters';
import FiltersSection from '../components/catalog/FiltersSection';
import SearchResults from '../components/catalog/SearchResults';
import CTASection from '../components/catalog/CTASection';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import { equipmentData, categories, sortOptions, stats } from '../components/shared/constants';
import { PopularEquipment } from '../components/shared/types';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState('popular');
  const [cartItems, setCartItems] = useState<number[]>([1, 3]);
  const [filteredEquipment, setFilteredEquipment] = useState<PopularEquipment[]>(equipmentData);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  // Фильтрация оборудования
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let filtered = equipmentData;

      // Фильтр по категории
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => 
          item.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Фильтр по поисковому запросу
      if (searchQuery) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Фильтр по цене
      filtered = filtered.filter(item => {
        const itemPrice = parseFloat(item.price);
        return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
      });

      // Сортировка
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-high':
          filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          filtered.sort((a, b) => b.reviews - a.reviews);
      }

      setFilteredEquipment(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (id: number) => {
    if (!cartItems.includes(id)) {
      setCartItems([...cartItems, id]);
    }
  };

  const handleRent = (id: number) => {
    handleAddToCart(id);
  };

  const handleQuickFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }

    switch (filter) {
      case 'featured':
        setSortBy('featured');
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 20000]);
    setSortBy('popular');
    setActiveFilters([]);
    if (searchRef.current) searchRef.current.focus();
  };

  const handleSelectAllCategories = () => {
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/20">
      <Background />
      
      <div className="relative">
        
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          
          <QuickFilters 
            activeFilters={activeFilters} 
            onFilterToggle={handleQuickFilter} 
          />
          
          <FiltersSection
            categories={categories}
            sortOptions={sortOptions}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onQuickFilter={handleQuickFilter}
          />
          
          {/* Статистика */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  delay={index * 100}
                  animateCount
                />
              ))}
            </div>
          </section>
          
          {/* Результаты поиска */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isLoading ? 'Загрузка...' : `Найдено ${filteredEquipment.length} единиц`}
                </h2>
                {activeFilters.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Применено фильтров: {activeFilters.length}
                  </p>
                )}
              </div>
              {(searchQuery || activeFilters.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2 hover-lift"
                >
                  Очистить фильтры
                </Button>
              )}
            </div>
            
            <SearchResults
              isLoading={isLoading}
              filteredEquipment={filteredEquipment}
              searchQuery={searchQuery}
              activeFilters={activeFilters}
              onClearFilters={handleClearFilters}
              onRent={handleRent}
              onSelectAllCategories={handleSelectAllCategories}
            />
          </section>
          
          <CTASection />
        </main>
      </div>
    </div>
  );
}