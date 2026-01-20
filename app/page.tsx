// app/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Menu, 
  ShoppingCart, 
  Heart, 
  User, 
  ChevronRight, 
  Star, 
  Shield, 
  Truck, 
  Clock, 
  Phone 
} from 'lucide-react';

interface EquipmentCategory {
  id: number;
  name: string;
  icon: string;
  count: number;
}

interface PopularEquipment {
  id: number;
  name: string;
  price: string;
  period: string;
  rating: number;
  reviews: number;
  category: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');

  // Данные для демонстрации
  const equipmentCategories: EquipmentCategory[] = [
    { id: 1, name: 'Аудио оборудование', icon: '🔊', count: 42 },
    { id: 2, name: 'Видео техника', icon: '📹', count: 28 },
    { id: 3, name: 'Осветительное оборудование', icon: '💡', count: 35 },
    { id: 4, name: 'Сценическое оборудование', icon: '🎭', count: 19 },
    { id: 5, name: 'Звуковое оборудование', icon: '🎵', count: 31 },
    { id: 6, name: 'Проекционное оборудование', icon: '📽️', count: 24 },
  ];

  const popularEquipment: PopularEquipment[] = [
    { 
      id: 1, 
      name: 'Профессиональный микшерный пульт Yamaha CL5', 
      price: '1 500',
      period: 'день',
      rating: 4.8,
      reviews: 124,
      category: 'Аудио'
    },
    { 
      id: 2, 
      name: 'LED панель 55" 4K Samsung', 
      price: '2 500',
      period: 'день',
      rating: 4.9,
      reviews: 89,
      category: 'Видео'
    },
    { 
      id: 3, 
      name: 'Прожектор Moving Head Beam 400W', 
      price: '1 800',
      period: 'день',
      rating: 4.7,
      reviews: 67,
      category: 'Освещение'
    },
    { 
      id: 4, 
      name: 'Акустическая система JBL SRX 2000W', 
      price: '2 200',
      period: 'день',
      rating: 4.9,
      reviews: 156,
      category: 'Аудио'
    },
  ];

  const features: Feature[] = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Быстрая доставка',
      description: 'Доставка оборудования в день заказа по Москве и области'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Гарантия качества',
      description: 'Все оборудование проходит регулярное техническое обслуживание'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Гибкая аренда',
      description: 'Аренда от нескольких часов до нескольких месяцев'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Поддержка 24/7',
      description: 'Консультации и помощь на всех этапах проведения мероприятия'
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Александр Петров',
      role: 'Организатор мероприятий',
      text: 'Отличный сервис! Оборудование всегда в идеальном состоянии, доставка вовремя.',
      rating: 5
    },
    {
      name: 'Марина Иванова',
      role: 'Event-менеджер',
      text: 'Работаем с этой компанией уже 2 года. Ни разу не подвели, все оборудование качественное.',
      rating: 5
    },
    {
      name: 'Дмитрий Сидоров',
      role: 'Владелец клуба',
      text: 'Лучшие цены на рынке при отличном качестве оборудования.',
      rating: 4
    },
  ];

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search:', { searchQuery, selectedCategory, selectedPrice });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} 
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Навигация */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-black rounded-lg">
                  <span className="text-white font-medium text-sm">ER</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">EventRent</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 ml-10">
                <Link href="/catalog" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Каталог
                </Link>
                <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Услуги
                </Link>
                <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  О компании
                </Link>
                <Link href="/contacts" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Контакты
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Search className="w-5 h-5" />
              </button>
              <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </button>
              <button className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                <User className="w-4 h-4 inline mr-2" />
                Войти
              </button>
              <button className="md:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero секция */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Аренда оборудования
              <span className="block mt-2 text-gray-600">для ваших мероприятий</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Всё необходимое для успешного проведения мероприятий: 
              от аудиотехники до осветительного оборудования с доставкой и настройкой
            </p>

            {/* Поиск */}
            <div className="mt-10 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Найдите необходимое оборудование..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Найти
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Все категории</option>
                    <option value="audio">Аудио оборудование</option>
                    <option value="video">Видео техника</option>
                    <option value="lighting">Осветительное оборудование</option>
                    <option value="stage">Сценическое оборудование</option>
                  </select>

                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Любая цена</option>
                    <option value="0-1000">до 1 000₽/день</option>
                    <option value="1000-3000">1 000-3 000₽/день</option>
                    <option value="3000-5000">3 000-5 000₽/день</option>
                    <option value="5000+">от 5 000₽/день</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Статистика */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">850+</div>
                <div className="mt-2 text-sm text-gray-600">Единиц оборудования</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2 400+</div>
                <div className="mt-2 text-sm text-gray-600">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="mt-2 text-sm text-gray-600">Положительных отзывов</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Категории оборудования */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Категории оборудования</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Широкий выбор профессионального оборудования для любых мероприятий
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentCategories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.count} позиций
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Популярное оборудование */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Популярное оборудование</h2>
              <p className="mt-2 text-gray-600">Часто арендуемое нашими клиентами</p>
            </div>
            <Link 
              href="/catalog" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Весь каталог
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularEquipment.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-600">({item.reviews})</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{item.price}₽</span>
                      <span className="text-gray-600">/{item.period}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800">
                    Арендовать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Почему выбирают нас</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Мы заботимся о каждом клиенте и обеспечиваем лучший сервис
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Отзывы клиентов</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Что говорят наши клиенты о работе с нами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200">
                <div className="mb-6">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-gray-600 mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Готовы начать аренду?</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Подберем оборудование под ваш бюджет и требования. Консультация бесплатно!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              type="button" 
              className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100"
            >
              Оставить заявку
            </button>
            <button 
              type="button" 
              className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10"
            >
              +7 (999) 123-45-67
            </button>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">ER</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">EventRent</span>
              </div>
              <p className="text-gray-600 text-sm">
                Профессиональная аренда оборудования для мероприятий с 2018 года
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Каталог</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Аудио оборудование</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Видео техника</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Освещение</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Сцена</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Компания</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">О нас</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Доставка и оплата</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Контакты</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Вакансии</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Контакты</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <p>г. Москва, ул. Примерная, 123</p>
                <p>+7 (999) 123-45-67</p>
                <p>info@eventrent.ru</p>
                <p>Ежедневно 9:00 - 21:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2024 EventRent. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}