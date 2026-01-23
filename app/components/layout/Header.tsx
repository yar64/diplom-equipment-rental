// app/components/layout/Header.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, Heart, User, 
  Sparkles, Bell, MapPin, Menu as MenuIcon,
  X, ChevronDown,
  Headphones, Sun, Camera, 
  Layers, Briefcase, Users, Calendar,
  Music, Mic2, Video, Tv, Palette,
  Wifi, Satellite, Server, Database,
  Radio, Cable, Battery, Router,
  AudioLines, Projector, Lightbulb,
  Music2, Utensils, Shield, Truck,
  Plane, Gamepad2, Building, GraduationCap,
  PartyPopper, Megaphone, Trophy, CameraOff
} from 'lucide-react';

// Центрированный dropdown контейнер для всей шапки
const CenteredDropdownContainer = ({ 
  children, 
  isOpen, 
  width = '900px',
  onMouseEnter,
  onMouseLeave 
}: { 
  children: React.ReactNode;
  isOpen: boolean;
  width?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <div 
      className={`fixed top-full left-1/2 -translate-x-1/2 mt-2 ${width} bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl transition-all duration-300 z-50 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ width }}
    >
      {children}
    </div>
  );
};

// Общий dropdown компонент для центрирования
const CenteredDropdown = ({ 
  title, 
  categories, 
  isOpen, 
  setIsOpen,
  width = '900px'
}: { 
  title: string;
  categories: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  width?: string;
}) => {
  return (
    <div className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <CenteredDropdownContainer 
        isOpen={isOpen} 
        width={width}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="p-6 grid grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <category.icon className="w-4 h-4" />
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item: any) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors block p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-b-xl">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${title.toLowerCase()}/catalog`} 
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Полный каталог →
            </Link>
            <div className="text-xs text-neutral-500 dark:text-neutral-500">
              {title === 'Оборудование' ? '1500+ единиц' : 
               title === 'Персонал' ? '500+ специалистов' : 
               '100+ решений'}
            </div>
          </div>
        </div>
      </CenteredDropdownContainer>
    </div>
  );
};

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Состояния для центрированных dropdown
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const equipmentCategories = [
    {
      title: 'Аудио',
      icon: Headphones,
      items: [
        { name: 'Концертные системы', href: '/equipment/audio/concert' },
        { name: 'Микшерные пульты', href: '/equipment/audio/mixers' },
        { name: 'Микрофоны', href: '/equipment/audio/microphones' },
        { name: 'Колонки', href: '/equipment/audio/speakers' },
      ]
    },
    {
      title: 'Свет',
      icon: Sun,
      items: [
        { name: 'Прожекторы', href: '/equipment/light/moving-head' },
        { name: 'LED экраны', href: '/equipment/light/led' },
        { name: 'Лазеры', href: '/equipment/light/laser' },
        { name: 'Световые эффекты', href: '/equipment/light/effects' },
      ]
    },
    {
      title: 'Видео',
      icon: Camera,
      items: [
        { name: 'Проекторы', href: '/equipment/video/projectors' },
        { name: 'Камеры PTZ', href: '/equipment/video/ptz' },
        { name: 'Видеомикшеры', href: '/equipment/video/switchers' },
        { name: 'Мониторы', href: '/equipment/video/monitors' },
      ]
    },
    {
      title: 'Сцена',
      icon: Layers,
      items: [
        { name: 'Модульные сцены', href: '/equipment/stage/modular' },
        { name: 'Трибуны', href: '/equipment/stage/seating' },
        { name: 'Декорации', href: '/equipment/stage/decor' },
        { name: 'Подвесные системы', href: '/equipment/stage/hanging' },
      ]
    },
    {
      title: 'Другое',
      icon: Server,
      items: [
        { name: 'Генераторы', href: '/equipment/additional/power' },
        { name: 'Кабели', href: '/equipment/additional/cables' },
        { name: 'Транспорт', href: '/equipment/additional/transport' },
        { name: 'Сетевое оборудование', href: '/equipment/additional/network' },
      ]
    }
  ];

  const staffCategories = [
    {
      title: 'Технический',
      icon: Mic2,
      items: [
        { name: 'Звукорежиссеры', href: '/staff/audio-engineers' },
        { name: 'Светотехники', href: '/staff/lighting' },
        { name: 'Видеооператоры', href: '/staff/video-operators' },
        { name: 'Монтажники', href: '/staff/assemblers' },
      ]
    },
    {
      title: 'Артистический',
      icon: Music2,
      items: [
        { name: 'Ведущие', href: '/staff/hosts' },
        { name: 'Музыканты', href: '/staff/musicians' },
        { name: 'Ди-джеи', href: '/staff/djs' },
        { name: 'Аниматоры', href: '/staff/animators' },
      ]
    },
    {
      title: 'Организационный',
      icon: Briefcase,
      items: [
        { name: 'Организаторы', href: '/staff/event-planners' },
        { name: 'Координаторы', href: '/staff/coordinators' },
        { name: 'Фотографы', href: '/staff/photographers' },
        { name: 'Стилисты', href: '/staff/stylists' },
      ]
    },
    {
      title: 'Сервисный',
      icon: Utensils,
      items: [
        { name: 'Официанты', href: '/staff/waiters' },
        { name: 'Бармены', href: '/staff/bartenders' },
        { name: 'Повара', href: '/staff/chefs' },
        { name: 'Хостес', href: '/staff/hostesses' },
      ]
    },
    {
      title: 'Управленческий',
      icon: Building,
      items: [
        { name: 'Менеджеры', href: '/staff/project-managers' },
        { name: 'Режиссеры', href: '/staff/directors' },
        { name: 'Продюсеры', href: '/staff/producers' },
        { name: 'Администраторы', href: '/staff/administrators' },
      ]
    }
  ];

  const eventTypes = [
    {
      icon: Music,
      name: 'Концерты',
      href: '/events/concerts'
    },
    {
      icon: Briefcase,
      name: 'Корпоративы',
      href: '/events/corporate'
    },
    {
      icon: Heart,
      name: 'Свадьбы',
      href: '/events/weddings'
    },
    {
      icon: GraduationCap,
      name: 'Конференции',
      href: '/events/conferences'
    },
    {
      icon: PartyPopper,
      name: 'Фестивали',
      href: '/events/festivals'
    },
    {
      icon: Megaphone,
      name: 'Выставки',
      href: '/events/exhibitions'
    },
    {
      icon: Trophy,
      name: 'Спортивные',
      href: '/events/sports'
    },
    {
      icon: Plane,
      name: 'Тимбилдинги',
      href: '/events/team-building'
    }
  ];

  const eventServices = [
    {
      icon: Calendar,
      name: 'Организация',
      href: '/services/organization'
    },
    {
      icon: Headphones,
      name: 'Техподдержка',
      href: '/services/technical'
    },
    {
      icon: Utensils,
      name: 'Кейтеринг',
      href: '/services/catering'
    },
    {
      icon: Truck,
      name: 'Транспорт',
      href: '/services/transport'
    },
    {
      icon: Shield,
      name: 'Страхование',
      href: '/services/insurance'
    },
    {
      icon: Palette,
      name: 'Оформление',
      href: '/services/decoration'
    },
    {
      icon: Gamepad2,
      name: 'Интерактивы',
      href: '/services/interactive'
    },
    {
      icon: CameraOff,
      name: 'Стриминг',
      href: '/services/streaming'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      {/* Верхняя панель с контактами */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>Москва</span>
              </div>
              <a href="tel:+78003332211" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                8 (800) 333-22-11
              </a>
              <span>Работаем 24/7</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1">
                <Bell className="w-3 h-3" />
                <span>Акции</span>
              </button>
              <button className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Для бизнеса
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Основная шапка с центрированной навигацией */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-neutral-900 dark:bg-neutral-100 rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-neutral-900 dark:bg-neutral-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <Sparkles className="w-5 h-5 text-white dark:text-black" />
              </div>
            </div>
            <div className="relative">
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">EventRent</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </div>
          </Link>

          {/* Центрированная навигация с dropdown */}
          <nav className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link 
              href="/"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors relative group"
            >
              Главная
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            
            <CenteredDropdown 
              title="Оборудование"
              categories={equipmentCategories}
              isOpen={equipmentOpen}
              setIsOpen={setEquipmentOpen}
              width="900px"
            />
            
            <CenteredDropdown 
              title="Персонал"
              categories={staffCategories}
              isOpen={staffOpen}
              setIsOpen={setStaffOpen}
              width="900px"
            />
            
            <div className="relative" 
              onMouseEnter={() => setEventsOpen(true)}
              onMouseLeave={() => setEventsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                Мероприятия
                <ChevronDown className={`w-4 h-4 transition-transform ${eventsOpen ? 'rotate-180' : ''}`} />
              </button>

              <CenteredDropdownContainer 
                isOpen={eventsOpen} 
                width="800px"
                onMouseEnter={() => setEventsOpen(true)}
                onMouseLeave={() => setEventsOpen(false)}
              >
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Типы мероприятий
                      </h3>
                      <ul className="space-y-2">
                        {eventTypes.map((item) => (
                          <li key={item.name}>
                            <Link 
                              href={item.href}
                              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Услуги
                      </h3>
                      <ul className="space-y-2">
                        {eventServices.map((item) => (
                          <li key={item.name}>
                            <Link 
                              href={item.href}
                              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <Link 
                        href="/events/calculator" 
                        className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                      >
                        Рассчитать стоимость мероприятия →
                      </Link>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        100+ реализованных проектов
                      </div>
                    </div>
                  </div>
                </div>
              </CenteredDropdownContainer>
            </div>
            
            <Link 
              href="/portfolio"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors relative group"
            >
              Портфолио
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            
            <Link 
              href="/contact"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors relative group"
            >
              Контакты
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>

          {/* Правая часть с действиями */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Поиск */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {searchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-neutral-400 ml-2" />
                    <input
                      type="text"
                      placeholder="Поиск оборудования, персонала, услуг..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                      autoFocus
                    />
                    <button className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-colors">
                      Найти
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-500 px-2">
                    Популярное: <span className="text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline">звук</span>, 
                    <span className="text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline ml-2">свет</span>, 
                    <span className="text-neutral-900 dark:text-neutral-100 cursor-pointer hover:underline ml-2">диджей</span>
                  </div>
                </div>
              )}
            </div>

            {/* Избранное */}
            <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Корзина */}
            <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs rounded-full flex items-center justify-center font-bold">
                5
              </span>
            </button>

            {/* Профиль */}
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300">
              <User className="w-4 h-4" />
              Войти
            </button>

            {/* Мобильное меню */}
            <button 
              className="lg:hidden text-neutral-900 dark:text-neutral-100 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Меню</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {['Главная', 'Оборудование', 'Персонал', 'Мероприятия', 'Портфолио', 'Контакты'].map((item) => (
                  <Link 
                    key={item}
                    href={item === 'Главная' ? '/' : `/${item.toLowerCase()}`}
                    className="block text-lg font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item === 'Оборудование' && <Headphones className="w-5 h-5" />}
                    {item === 'Персонал' && <Users className="w-5 h-5" />}
                    {item === 'Мероприятия' && <Calendar className="w-5 h-5" />}
                    {item === 'Портфолио' && <Briefcase className="w-5 h-5" />}
                    {item === 'Контакты' && <MapPin className="w-5 h-5" />}
                    {item === 'Главная' && <Sparkles className="w-5 h-5" />}
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}