// app/components/layout/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, Heart, User, 
  Sparkles, Bell, MapPin, Menu as MenuIcon,
  X, ChevronDown, ChevronRight,
  Headphones, Sun, Camera, 
  Layers, Briefcase, Users, Calendar,
  Music, Mic2, Video, Tv, Palette,
  Wifi, Satellite, Server, Database,
  Radio, Cable, Battery, Router,
  AudioLines, Projector, Lightbulb,
  Music2, Utensils, Shield, Truck,
  Plane, Gamepad2, Building, GraduationCap,
  PartyPopper, Megaphone, Trophy, CameraOff,
  Home, Package, Users as UsersIcon,
  CalendarDays, FolderOpen, Phone
} from 'lucide-react';

// Центрированный dropdown контейнер для десктопа
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
      className={`fixed top-full left-1/2 -translate-x-1/2 mt-2 hidden lg:block ${width} bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl transition-all duration-300 z-50 ${
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

// Мобильный dropdown компонент
const MobileDropdown = ({ 
  title, 
  icon: Icon,
  children,
  isOpen,
  onToggle 
}: { 
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-t border-neutral-100 dark:border-neutral-800 first:border-t-0">
      <button 
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-lg font-medium text-neutral-900 dark:text-neutral-100"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </div>
        <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="pb-4 pl-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    equipment: false,
    staff: false,
    events: false
  });
  
  // Состояния для центрированных dropdown
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  // Закрытие меню при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileDropdown = (dropdown: keyof typeof mobileDropdowns) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

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

  // Мобильная навигация
  const mobileNavItems = [
    { name: 'Главная', icon: Home, href: '/' },
    { name: 'Оборудование', icon: Package, href: '#', hasDropdown: true },
    { name: 'Персонал', icon: UsersIcon, href: '#', hasDropdown: true },
    { name: 'Мероприятия', icon: CalendarDays, href: '#', hasDropdown: true },
    { name: 'Портфолио', icon: FolderOpen, href: '/portfolio' },
    { name: 'Контакты', icon: Phone, href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      {/* Верхняя панель с контактами - скрываем на мобильных */}
      <div className="hidden md:block border-b border-neutral-200 dark:border-neutral-800">
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

      {/* Основная шапка */}
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
            <div className="relative hidden sm:block">
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">EventRent</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </div>
          </Link>

          {/* Центрированная навигация с dropdown - только для десктопа */}
          <nav className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link 
              href="/"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors relative group"
            >
              Главная
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            
            {/* Equipment Dropdown */}
            <div className="relative"
              onMouseEnter={() => setEquipmentOpen(true)}
              onMouseLeave={() => setEquipmentOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                Оборудование
                <ChevronDown className={`w-4 h-4 transition-transform ${equipmentOpen ? 'rotate-180' : ''}`} />
              </button>

              <CenteredDropdownContainer 
                isOpen={equipmentOpen} 
                width="900px"
                onMouseEnter={() => setEquipmentOpen(true)}
                onMouseLeave={() => setEquipmentOpen(false)}
              >
                <div className="p-6 grid grid-cols-5 gap-6">
                  {equipmentCategories.map((category) => (
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
                      href="/equipment/catalog" 
                      className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    >
                      Полный каталог →
                    </Link>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      1500+ единиц
                    </div>
                  </div>
                </div>
              </CenteredDropdownContainer>
            </div>
            
            {/* Staff Dropdown */}
            <div className="relative"
              onMouseEnter={() => setStaffOpen(true)}
              onMouseLeave={() => setStaffOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                Персонал
                <ChevronDown className={`w-4 h-4 transition-transform ${staffOpen ? 'rotate-180' : ''}`} />
              </button>

              <CenteredDropdownContainer 
                isOpen={staffOpen} 
                width="900px"
                onMouseEnter={() => setStaffOpen(true)}
                onMouseLeave={() => setStaffOpen(false)}
              >
                <div className="p-6 grid grid-cols-5 gap-6">
                  {staffCategories.map((category) => (
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
                      href="/staff/catalog" 
                      className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    >
                      Полный каталог →
                    </Link>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      500+ специалистов
                    </div>
                  </div>
                </div>
              </CenteredDropdownContainer>
            </div>
            
            {/* Events Dropdown */}
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
            {/* Поиск - мобильная версия */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Поиск"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Мобильный поиск */}
              {searchOpen && (
                <div className="fixed inset-0 z-50 lg:hidden bg-white dark:bg-black">
                  <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 mb-4">
                      <button 
                        onClick={() => setSearchOpen(false)}
                        className="p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                        <Search className="w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Поиск оборудования, персонала, услуг..."
                          className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Популярное:</h3>
                      <div className="flex flex-wrap gap-2">
                        {['звук', 'свет', 'диджей', 'проектор', 'колонки', 'микрофон'].map((tag) => (
                          <button
                            key={tag}
                            className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Десктопный поиск */}
              {searchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 hidden lg:block bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-2 z-50">
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

            {/* Избранное и корзина - скрываем на маленьких экранах */}
            <div className="hidden sm:flex items-center gap-2">
              <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              <button className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs rounded-full flex items-center justify-center font-bold">
                  5
                </span>
              </button>
            </div>

            {/* Профиль - меняем на иконку на мобильных */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-300">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Войти</span>
            </button>
            
            <button className="sm:hidden p-2 text-neutral-900 dark:text-neutral-100">
              <User className="w-5 h-5" />
            </button>

            {/* Мобильное меню */}
            <button 
              className="lg:hidden text-neutral-900 dark:text-neutral-100 p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto animate-in slide-in-from-right-80 duration-300">
            <div className="p-4">
              {/* Заголовок меню */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-900 dark:bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white dark:text-black" />
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">EventRent</h2>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  aria-label="Закрыть меню"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Контакты в мобильном меню */}
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-900 dark:text-neutral-100">Москва</span>
                </div>
                <a 
                  href="tel:+78003332211"
                  className="block text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:text-primary transition-colors mb-1"
                >
                  8 (800) 333-22-11
                </a>
                <p className="text-xs text-neutral-500">Работаем 24/7</p>
              </div>
              
              {/* Навигация */}
              <div className="space-y-1">
                <MobileDropdown 
                  title="Главная"
                  icon={Home}
                  isOpen={false}
                  onToggle={() => {
                    setMobileMenuOpen(false);
                    window.location.href = '/';
                  }}
                >
                  <div className="space-y-2">
                    <Link 
                      href="/"
                      className="block py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Домашняя страница
                    </Link>
                  </div>
                </MobileDropdown>
                
                <MobileDropdown 
                  title="Оборудование"
                  icon={Package}
                  isOpen={mobileDropdowns.equipment}
                  onToggle={() => toggleMobileDropdown('equipment')}
                >
                  <div className="space-y-4">
                    {equipmentCategories.map((category) => (
                      <div key={category.title}>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.title}
                        </h4>
                        <ul className="space-y-1 pl-6">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <Link 
                                href={item.href}
                                className="block py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link 
                      href="/equipment/catalog"
                      className="block mt-4 py-2 px-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-center text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Весь каталог оборудования →
                    </Link>
                  </div>
                </MobileDropdown>
                
                <MobileDropdown 
                  title="Персонал"
                  icon={UsersIcon}
                  isOpen={mobileDropdowns.staff}
                  onToggle={() => toggleMobileDropdown('staff')}
                >
                  <div className="space-y-4">
                    {staffCategories.map((category) => (
                      <div key={category.title}>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.title}
                        </h4>
                        <ul className="space-y-1 pl-6">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <Link 
                                href={item.href}
                                className="block py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link 
                      href="/staff/catalog"
                      className="block mt-4 py-2 px-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-center text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Все специалисты →
                    </Link>
                  </div>
                </MobileDropdown>
                
                <MobileDropdown 
                  title="Мероприятия"
                  icon={CalendarDays}
                  isOpen={mobileDropdowns.events}
                  onToggle={() => toggleMobileDropdown('events')}
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Типы мероприятий
                      </h4>
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        {eventTypes.map((item) => (
                          <Link 
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5 mb-2 text-neutral-900 dark:text-neutral-100" />
                            <span className="text-xs text-center text-neutral-700 dark:text-neutral-300">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Услуги
                      </h4>
                      <div className="grid grid-cols-2 gap-2 pl-6">
                        {eventServices.slice(0, 4).map((item) => (
                          <Link 
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5 mb-2 text-neutral-900 dark:text-neutral-100" />
                            <span className="text-xs text-center text-neutral-700 dark:text-neutral-300">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <Link 
                      href="/events/calculator"
                      className="block mt-4 py-3 px-4 bg-primary/10 text-primary rounded-lg text-center text-sm font-medium hover:bg-primary/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Рассчитать стоимость мероприятия →
                    </Link>
                  </div>
                </MobileDropdown>
                
                <Link 
                  href="/portfolio"
                  className="flex items-center gap-3 py-4 px-2 text-lg font-medium text-neutral-900 dark:text-neutral-100 border-t border-neutral-100 dark:border-neutral-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FolderOpen className="w-5 h-5" />
                  Портфолио
                </Link>
                
                <Link 
                  href="/contact"
                  className="flex items-center gap-3 py-4 px-2 text-lg font-medium text-neutral-900 dark:text-neutral-100 border-t border-neutral-100 dark:border-neutral-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="w-5 h-5" />
                  Контакты
                </Link>
              </div>
              
              {/* Быстрые действия в мобильном меню */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <button className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Heart className="w-5 h-5 mb-1 text-neutral-900 dark:text-neutral-100" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300">Избранное</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <ShoppingCart className="w-5 h-5 mb-1 text-neutral-900 dark:text-neutral-100" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300">Корзина</span>
                    <span className="absolute mt-[-5px] ml-[20px] w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                      5
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Bell className="w-5 h-5 mb-1 text-neutral-900 dark:text-neutral-100" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300">Акции</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Briefcase className="w-5 h-5 mb-1 text-neutral-900 dark:text-neutral-100" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300">Бизнесу</span>
                  </button>
                </div>
                
                <button className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  Войти в аккаунт
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Нижняя мобильная навигация */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 shadow-lg">
        <div className="flex items-center justify-around h-16">
          <Link 
            href="/" 
            className="flex flex-col items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Главная</span>
          </Link>
          
          <button 
            className="flex flex-col items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors relative"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Меню</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors relative"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Поиск</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Корзина</span>
            <span className="absolute top-1 right-3 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
              5
            </span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
}