// app/services/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Zap, Truck, Shield, Clock, Users, Settings, 
  Award, CheckCircle, Calendar, Package, 
  Headphones, Globe, Sparkles, ArrowRight,
  Monitor, Volume2, Sun, Camera, Music,
  Cpu, Radio, Wifi, Satellite, Cctv, HardDrive,
  Mic2, Headphones as HeadphonesIcon, Film, Projector,
  Cable, Server, Database, Router,
  ChevronRight, Play, Pause, BarChart3, Circle,
  Layers, Video, Speaker,
  BatteryCharging, FileText, TrendingUp,
  ChevronLeft, PauseCircle, PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Упрощенный компонент с ограниченными анимациями
const ServiceCard = ({ 
  service, 
  index 
}: { 
  service: Service; 
  index: number;
}) => (
  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-900 dark:text-gray-100">
            {service.icon}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{service.equipmentCount}+</div>
          <span className="text-sm text-gray-500">единиц</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {service.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {service.name}
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        {service.description}
      </p>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          Технические характеристики: <span className="font-medium text-gray-700 dark:text-gray-300">{service.stats}</span>
        </div>
        
        <ul className="space-y-2">
          {service.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-gray-700 dark:text-gray-300">{feature.name}</span>
              {feature.value && (
                <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {feature.value}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{service.prepTime}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
          >
            <span>Детали</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Типы услуг
interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: { name: string; value?: string }[];
  equipmentCount?: number;
  prepTime: string;
  stats: string;
}

const services: Service[] = [
  {
    id: 1,
    name: 'Концертные аудиосистемы',
    description: 'Профессиональное звуковое оборудование для мероприятий любого масштаба.',
    category: 'Аудио',
    icon: <Volume2 className="w-8 h-8" />,
    features: [
      { name: 'Линейные массивы', value: '20kW+' },
      { name: 'Цифровые микшеры', value: '48 каналов' },
      { name: 'Радиомикрофоны', value: 'UHF диапазон' },
    ],
    equipmentCount: 156,
    prepTime: '4-6 часов',
    stats: 'До 120dB, 20-20кГц'
  },
  {
    id: 2,
    name: 'Световое оформление',
    description: 'Современные световые решения и визуальные эффекты.',
    category: 'Свет',
    icon: <Sun className="w-8 h-8" />,
    features: [
      { name: 'Moving Head прожекторы', value: '400W' },
      { name: 'LED видеоэкраны', value: 'P4, 4K' },
      { name: 'Лазерные системы', value: 'RGB 5W' },
    ],
    equipmentCount: 92,
    prepTime: '6-8 часов',
    stats: '1000+ светильников'
  },
  {
    id: 3,
    name: 'Видео и live-трансляции',
    description: 'Оборудование для съемки и трансляции мероприятий.',
    category: 'Видео',
    icon: <Camera className="w-8 h-8" />,
    features: [
      { name: 'PTZ камеры 4K', value: '12x zoom' },
      { name: 'Видеомикшеры ATEM', value: '8 входов' },
      { name: 'Кодирующие станции', value: 'H.265' },
    ],
    equipmentCount: 78,
    prepTime: '8-10 часов',
    stats: 'До 8K, 60fps'
  },
  {
    id: 4,
    name: 'Сценические конструкции',
    description: 'Надежные конструкции для любых площадок.',
    category: 'Сцена',
    icon: <Layers className="w-8 h-8" />,
    features: [
      { name: 'Модульные сцены', value: '3x3м' },
      { name: 'Трибуны трансформеры', value: '200+ мест' },
      { name: 'Подвесные фермы', value: 'до 5т' },
    ],
    equipmentCount: 64,
    prepTime: '12-24 часа',
    stats: 'Выдерживает 500кг/м²'
  }
];

const techEquipmentCategories = [
  {
    title: 'Сетевые решения',
    icon: <Wifi className="w-6 h-6" />,
    items: [
      { icon: <Router className="w-5 h-5" />, name: 'Маршрутизаторы' },
      { icon: <Server className="w-5 h-5" />, name: 'Коммутаторы' },
    ]
  },
  {
    title: 'Серверное оборудование',
    icon: <Database className="w-6 h-6" />,
    items: [
      { icon: <Cpu className="w-5 h-5" />, name: 'Процессоры' },
      { icon: <HardDrive className="w-5 h-5" />, name: 'SSD массивы' },
    ]
  },
  {
    title: 'Беспроводные системы',
    icon: <Radio className="w-6 h-6" />,
    items: [
      { icon: <Satellite className="w-5 h-5" />, name: 'Радиосистемы' },
      { icon: <Wifi className="w-5 h-5" />, name: 'Wi-Fi 6' },
    ]
  },
  {
    title: 'Системы питания',
    icon: <BatteryCharging className="w-6 h-6" />,
    items: [
      { icon: <Zap className="w-5 h-5" />, name: 'ИБП' },
      { icon: <Zap className="w-5 h-5" />, name: 'Генераторы' },
    ]
  }
];

const workflowSteps = [
  { 
    step: '01',
    title: 'Технический аудит',
    description: 'Анализ площадки и требований',
    icon: Settings,
    duration: '2-4 часа'
  },
  { 
    step: '02', 
    title: 'Проектирование',
    description: 'Разработка технического плана',
    icon: FileText,
    duration: '1-2 дня'
  },
  { 
    step: '03', 
    title: 'Подбор оборудования',
    description: 'Комплектация под задачи',
    icon: Package,
    duration: '3-5 дней'
  },
  { 
    step: '04', 
    title: 'Доставка и монтаж',
    description: 'Логистика и установка',
    icon: Truck,
    duration: '6-12 часов'
  },
  { 
    step: '05', 
    title: 'Тестирование',
    description: 'Полная проверка систем',
    icon: CheckCircle,
    duration: '4-8 часов'
  },
  { 
    step: '06', 
    title: 'Сопровождение',
    description: 'Техподдержка 24/7',
    icon: Headphones,
    duration: '24/7'
  },
];

const techStats = [
  { value: '1500+', label: 'Единиц оборудования', icon: Package },
  { value: '99.7%', label: 'Надежность систем', icon: Shield },
  { value: '45 мин', label: 'Время реакции', icon: Clock },
  { value: '98%', label: 'Удовлетворенность', icon: Users },
  { value: '12 ч', label: 'Развертывание', icon: Zap },
  { value: '5 лет', label: 'Гарантия', icon: Award },
];

export default function ServicesPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(Math.min((currentScroll / totalScroll) * 100, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % techEquipmentCategories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          {/* Скелетон для заголовка */}
          <div className="text-center mb-12">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Скелетон для услуг */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Упрощенный прогресс-бар */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-100 dark:bg-gray-900">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* Герой-секция */}
        <section className="mb-12 md:mb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-primary">ТЕХНОЛОГИЧЕСКИЕ РЕШЕНИЯ</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 leading-tight">
              <span className="block">ТЕХНИЧЕСКИЕ</span>
              <span className="block text-primary">УСЛУГИ</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto">
              Комплексные решения для мероприятий любого масштаба
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="gap-3 px-6 md:px-8"
                >
                  <span>ИССЛЕДОВАТЬ КАТАЛОГ</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="gap-3 px-6 md:px-8"
              >
                <HeadphonesIcon className="w-5 h-5" />
                <span>КОНСУЛЬТАЦИЯ</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Раздел статистики */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              НАША ЭКСПЕРТИЗА В ЦИФРАХ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Более 10 лет создаем технологическую инфраструктуру
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {techStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900 mb-3">
                  <stat.icon className="w-6 h-6 text-primary mx-auto" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Услуги */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ПРОФЕССИОНАЛЬНЫЕ УСЛУГИ
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Полный цикл технического обеспечения мероприятий
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </section>

        {/* Рабочий процесс */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ТЕХНОЛОГИЧЕСКИЙ ПРОЦЕСС
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              6 этапов профессионального подхода
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                          {step.step}
                        </div>
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        {step.description}
                      </p>
                      
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-500">
                          Время: <span className="font-medium text-gray-700 dark:text-gray-300">{step.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Категории оборудования */}
        <section className="mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                КАТЕГОРИИ ОБОРУДОВАНИЯ
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Более 50+ категорий профессиональной техники
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="gap-2 w-full md:w-auto"
            >
              {isAutoPlay ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              {isAutoPlay ? 'Пауза' : 'Автопрокрутка'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {techEquipmentCategories.map((category, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 ${
                  idx === activeCategory ? 'scale-[1.02]' : ''
                }`}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {category.title}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {category.items.length} типов
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-800">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* CTA секция */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800">
            <div className="relative py-12 md:py-16 px-4 sm:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-gray-800 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ИНДИВИДУАЛЬНЫЙ ПОДХОД
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
                  ГОТОВЫ СОЗДАТЬ
                  <span className="block text-primary">УНИКАЛЬНОЕ МЕРОПРИЯТИЕ?</span>
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Наша команда разработает комплексное решение, учитывающее все технические нюансы
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="gap-3 w-full sm:w-auto"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>ОБСУДИТЬ ПРОЕКТ</span>
                    </Button>
                  </Link>
                  
                  <Link href="/catalog">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-3 w-full sm:w-auto"
                    >
                      <Globe className="w-5 h-5" />
                      <span>ПОЛНЫЙ КАТАЛОГ</span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Поддержка 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Ответ за 15 минут</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Гарантия 5 лет</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}