// app/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, Trash2, Calendar, Clock, Package, 
  ShoppingCart, Filter, SortAsc, X, Plus,
  Share2, Bell, Sparkles, ArrowLeft, Tag
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Toggle from '../components/ui/Toggle';
import Select from '../components/ui/Select';

interface FavoriteItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  dailyPrice: number;
  minRentalDays: number;
  images: string[];
  specs: {
    power?: string;
    weight?: string;
    dimensions?: string;
  };
  availability: {
    inStock: boolean;
    nextAvailable?: string;
  };
  rating: number;
  reviews: number;
  lastViewed: string;
  addedAt: string;
  isAvailableForDates?: boolean;
}

const MOCK_FAVORITES: FavoriteItem[] = [
  {
    id: '1',
    name: 'Концертная акустика JBL VRX915',
    category: 'Аудио',
    subcategory: 'Концертная акустика',
    dailyPrice: 8000,
    minRentalDays: 2,
    images: ['/equipment/audio1.jpg'],
    specs: {
      power: '1500W',
      weight: '42 кг',
      dimensions: '120×60×50 см'
    },
    availability: {
      inStock: true,
      nextAvailable: 'Сегодня'
    },
    rating: 4.8,
    reviews: 24,
    lastViewed: '2 часа назад',
    addedAt: '15.03.2024',
    isAvailableForDates: true
  },
  {
    id: '2',
    name: 'LED-экран P4 6×3м с обработкой',
    category: 'Видео',
    subcategory: 'LED экраны',
    dailyPrice: 25000,
    minRentalDays: 3,
    images: ['/equipment/video1.jpg'],
    specs: {
      power: '5000W',
      weight: '320 кг',
      dimensions: '600×300×15 см'
    },
    availability: {
      inStock: true,
      nextAvailable: 'Завтра'
    },
    rating: 4.9,
    reviews: 18,
    lastViewed: 'вчера',
    addedAt: '10.03.2024',
    isAvailableForDates: true
  },
  {
    id: '3',
    name: 'Прожекторы Clay Paky A.leda B-EYE K20',
    category: 'Свет',
    subcategory: 'Интеллектуальный свет',
    dailyPrice: 4000,
    minRentalDays: 1,
    images: ['/equipment/light1.jpg'],
    specs: {
      power: '750W',
      weight: '28 кг',
      dimensions: '60×40×40 см'
    },
    availability: {
      inStock: false,
      nextAvailable: '25.03.2024'
    },
    rating: 4.7,
    reviews: 31,
    lastViewed: 'неделю назад',
    addedAt: '05.03.2024',
    isAvailableForDates: false
  },
  {
    id: '4',
    name: 'Микшерный пульт Allen & Heath dLive S7000',
    category: 'Аудио',
    subcategory: 'Микшерные пульты',
    dailyPrice: 12000,
    minRentalDays: 2,
    images: ['/equipment/audio2.jpg'],
    specs: {
      power: '120W',
      weight: '18 кг',
      dimensions: '100×60×15 см'
    },
    availability: {
      inStock: true,
      nextAvailable: 'Сегодня'
    },
    rating: 5.0,
    reviews: 12,
    lastViewed: '3 дня назад',
    addedAt: '01.03.2024',
    isAvailableForDates: true
  },
  {
    id: '5',
    name: 'Сценическая конструкция 6×4×3м',
    category: 'Сцена',
    subcategory: 'Модульные сцены',
    dailyPrice: 15000,
    minRentalDays: 3,
    images: ['/equipment/stage1.jpg'],
    specs: {
      power: '-',
      weight: '800 кг',
      dimensions: '600×400×300 см'
    },
    availability: {
      inStock: true,
      nextAvailable: 'Завтра'
    },
    rating: 4.6,
    reviews: 8,
    lastViewed: 'месяц назад',
    addedAt: '20.02.2024',
    isAvailableForDates: true
  },
  {
    id: '6',
    name: 'Генератор Caterpillar 100 кВт',
    category: 'Энергетика',
    subcategory: 'Генераторы',
    dailyPrice: 18000,
    minRentalDays: 2,
    images: ['/equipment/power1.jpg'],
    specs: {
      power: '100 кВт',
      weight: '1200 кг',
      dimensions: '300×150×180 см'
    },
    availability: {
      inStock: false,
      nextAvailable: '28.03.2024'
    },
    rating: 4.8,
    reviews: 15,
    lastViewed: '2 недели назад',
    addedAt: '15.02.2024',
    isAvailableForDates: false
  },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Все категории' },
  { value: 'audio', label: 'Аудио' },
  { value: 'video', label: 'Видео' },
  { value: 'light', label: 'Свет' },
  { value: 'stage', label: 'Сцена' },
  { value: 'power', label: 'Энергетика' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price-asc', label: 'Цена (по возрастанию)' },
  { value: 'price-desc', label: 'Цена (по убыванию)' },
  { value: 'popular', label: 'По популярности' },
  { value: 'available', label: 'Сначала доступные' },
];

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(MOCK_FAVORITES);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  // Фильтрация и сортировка
  const filteredFavorites = favorites
    .filter(item => {
      if (categoryFilter !== 'all') {
        const categoryMap: Record<string, string> = {
          audio: 'Аудио',
          video: 'Видео',
          light: 'Свет',
          stage: 'Сцена',
          power: 'Энергетика'
        };
        return item.category === categoryMap[categoryFilter];
      }
      return true;
    })
    .filter(item => !showOnlyAvailable || item.availability.inStock)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'oldest':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'price-asc':
          return a.dailyPrice - b.dailyPrice;
        case 'price-desc':
          return b.dailyPrice - a.dailyPrice;
        case 'popular':
          return b.rating - a.rating;
        case 'available':
          return (b.availability.inStock ? 1 : 0) - (a.availability.inStock ? 1 : 0);
        default:
          return 0;
      }
    });

  // Обработчики
  const handleRemoveItem = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleRemoveSelected = () => {
    setFavorites(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setIsSelecting(false);
  };

  const handleAddToCart = (item: FavoriteItem) => {
    // В реальном приложении здесь был бы API вызов
    alert(`${item.name} добавлено в корзину!`);
  };

  const handleAddAllToCart = () => {
    const availableItems = filteredFavorites.filter(item => item.availability.inStock);
    if (availableItems.length > 0) {
      alert(`${availableItems.length} доступных товаров добавлено в корзину!`);
    } else {
      alert('Нет доступных товаров для добавления в корзину');
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item.id));
    }
  };

  const handleCompare = () => {
    if (selectedItems.length >= 2) {
      const selectedNames = favorites
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.name);
      alert(`Сравнение: ${selectedNames.join(', ')}`);
      // В реальном приложении здесь был бы переход на страницу сравнения
    } else {
      alert('Выберите минимум 2 товара для сравнения');
    }
  };

  // Сброс всех фильтров
  const handleResetFilters = () => {
    setCategoryFilter('all');
    setSortBy('newest');
    setShowOnlyAvailable(false);
    setShowFilters(false);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Избранное пусто</h2>
          <p className="text-muted-foreground mb-8">
            Добавляйте понравившееся оборудование, чтобы не потерять
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/catalog')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Заголовок и управление */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">Избранное</h1>
              </div>
              <p className="text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'товар' : 
                  favorites.length > 1 && favorites.length < 5 ? 'товара' : 'товаров'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {!isSelecting ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsSelecting(true)}
                  >
                    Выбрать
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddAllToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    В корзину (все)
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSelecting(false);
                      setSelectedItems([]);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Отмена
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveSelected}
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить выбранное
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCompare}
                    disabled={selectedItems.length < 2}
                  >
                    Сравнить ({selectedItems.length})
                  </Button>
                  {selectedItems.length > 0 && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        const selected = favorites.filter(item => selectedItems.includes(item.id));
                        selected.forEach(handleAddToCart);
                        setIsSelecting(false);
                        setSelectedItems([]);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      В корзину ({selectedItems.length})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Фильтры и сортировка */}
          {(showFilters || isSelecting) && (
            <Card className="mb-6">
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {isSelecting ? (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredFavorites.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="font-medium">
                          Выбрать все ({filteredFavorites.length})
                        </span>
                      </label>
                      <span className="text-sm text-muted-foreground">
                        Выбрано: {selectedItems.length}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="w-full sm:w-48">
                        <Select
                          value={categoryFilter}
                          onChange={setCategoryFilter}
                          options={CATEGORY_OPTIONS}
                          label="Категория"
                          selectSize="sm"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <Select
                          value={sortBy}
                          onChange={setSortBy}
                          options={SORT_OPTIONS}
                          label="Сортировка"
                          icon={<SortAsc className="w-4 h-4" />}
                          selectSize="sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={showOnlyAvailable}
                          onCheckedChange={setShowOnlyAvailable}
                        />
                        <span className="text-sm font-medium">Только доступные</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isSelecting && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResetFilters}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Сбросить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFilters(false)}
                        >
                          Скрыть фильтры
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Активные фильтры */}
                {!isSelecting && (categoryFilter !== 'all' || showOnlyAvailable) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {categoryFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          Категория: {CATEGORY_OPTIONS.find(c => c.value === categoryFilter)?.label}
                          <button
                            onClick={() => setCategoryFilter('all')}
                            className="ml-1 hover:text-primary/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {showOnlyAvailable && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          Только доступные
                          <button
                            onClick={() => setShowOnlyAvailable(false)}
                            className="ml-1 hover:text-emerald-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Доступно сейчас</p>
                    <p className="text-2xl font-bold">
                      {favorites.filter(f => f.availability.inStock).length}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Средняя цена</p>
                    <p className="text-2xl font-bold">
                      {Math.round(favorites.reduce((sum, f) => sum + f.dailyPrice, 0) / favorites.length).toLocaleString()} ₽/сут
                    </p>
                  </div>
                  <Tag className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Последнее обновление</p>
                    <p className="text-2xl font-bold">2 часа назад</p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Список избранного */}
        <div className="space-y-6">
          {filteredFavorites.map((item) => (
            <Card 
              key={item.id} 
              className={`transition-all duration-300 hover:shadow-lg ${
                selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Чекбокс выбора */}
                  {isSelecting && (
                    <div className="p-6 flex items-center justify-center md:border-r">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  )}

                  {/* Изображение */}
                  <div className="md:w-48 flex-shrink-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex items-center justify-center overflow-hidden relative">
                      <div className="absolute top-3 right-3">
                        {item.availability.inStock ? (
                          <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                            ✓ В наличии
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                            {item.availability.nextAvailable}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>

                  {/* Информация */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.subcategory} • Добавлено {item.addedAt}
                            </p>
                          </div>
                          {!isSelecting && (
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1"
                              title="Удалить из избранного"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Спецификации */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-4 mb-3">
                            {item.specs.power && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    ⚡
                                  </span>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Мощность</div>
                                  <div className="text-sm font-medium">{item.specs.power}</div>
                                </div>
                              </div>
                            )}
                            {item.specs.weight && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                    ⚖️
                                  </span>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Вес</div>
                                  <div className="text-sm font-medium">{item.specs.weight}</div>
                                </div>
                              </div>
                            )}
                            {item.specs.dimensions && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    📐
                                  </span>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Габариты</div>
                                  <div className="text-sm font-medium">{item.specs.dimensions}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Рейтинг */}
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(item.rating)
                                      ? 'text-amber-500'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-medium">{item.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({item.reviews} отзывов)
                            </span>
                            <span className="text-sm text-muted-foreground ml-auto">
                              Просмотрено: {item.lastViewed}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Правая колонка - Цены и действия */}
                      <div className="lg:w-48 flex-shrink-0">
                        <div className="space-y-4">
                          <div>
                            <div className="text-2xl font-bold text-foreground mb-1">
                              {item.dailyPrice.toLocaleString()} ₽
                            </div>
                            <div className="text-sm text-muted-foreground">
                              за сутки • от {item.minRentalDays} дней
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Button
                              variant="primary"
                              size="sm"
                              fullWidth
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.availability.inStock}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              В корзину
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              fullWidth
                              onClick={() => router.push(`/equipment/${item.id}`)}
                            >
                              Подробнее
                            </Button>
                            {!isSelecting && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowPriceAlert(!showPriceAlert)}
                                  className="flex-1 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                                >
                                  <Bell className="w-3 h-3" />
                                  Уведомление
                                </button>
                                <button
                                  onClick={() => setShareModal(true)}
                                  className="flex-1 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                                >
                                  <Share2 className="w-3 h-3" />
                                  Поделиться
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Пагинация и итоги */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Показано {filteredFavorites.length} из {favorites.length} товаров
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/catalog')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Продолжить выбор
              </Button>
              
              <Button
                variant="primary"
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Перейти в корзину
              </Button>
            </div>
          </div>

          {/* Совет */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Совет от EventRent</h4>
                <p className="text-sm text-muted-foreground">
                  Сохраняйте в избранное понравившееся оборудование, чтобы быстро собрать комплект
                  для мероприятия. Вы можете поделиться списком с коллегами или заказать консультацию
                  специалиста по подобранному оборудованию.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка уведомления о цене */}
      {showPriceAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Уведомление о цене</h3>
            <p className="text-muted-foreground mb-6">
              Мы сообщим вам, когда цена на выбранное оборудование изменится
              или появится специальное предложение.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowPriceAlert(false)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  alert('Уведомление настроено!');
                  setShowPriceAlert(false);
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Включить уведомления
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}