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
  Cable, Server, WifiOff, Bluetooth, Database, Router,
  ChevronRight, Play, Pause, BarChart3, Circle,
  Layers, Grid3x3, Video, Smartphone,
  Tv, Speaker, Keyboard, Terminal, Cloud, GitBranch,
  Cpu as CpuIcon, CircuitBoard, Network,
  BatteryCharging, HardDrive as HardDriveIcon, GitMerge,
  Radio as RadioIcon, SatelliteDish, UploadCloud,
  DownloadCloud, Database as DatabaseIcon, Box,
  Palette, FileText, Cctv as CctvIcon, Gamepad2,
  QrCode, Scan, Fingerprint, Lock, Unlock, ShieldCheck,
  AlertTriangle, Bell, BellOff, Eye, EyeOff, Filter,
  Layout, Map, Navigation, Compass, Radar, Rss,
  Signal, Wifi as WifiIcon, Zap as ZapIcon,
  BatteryFull, Power, Plug, PowerOff, RefreshCw,
  RotateCcw, RotateCw, Save, Share2, Shuffle,
  SkipBack, SkipForward, Sliders, Snowflake,
  Star, Tag, Target, Thermometer, ToggleLeft,
  ToggleRight, Trash2, TrendingUp,
  TrendingDown, Truck as TruckIcon, Umbrella,
  UserCheck, UserPlus, Users as UsersIcon,
  Voicemail, VolumeX, Watch, Wind, XCircle,
  Youtube, ZoomIn, ZoomOut
} from 'lucide-react';
import Link from 'next/link';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Кастомный компонент с улучшенной анимацией
const AnimatedServiceCard = ({ 
  service, 
  isHovered 
}: { 
  service: Service; 
  isHovered: boolean;
}) => (
  <div 
    className={`relative group transition-all duration-500 ${
      isHovered ? 'scale-[1.02]' : ''
    }`}
  >
    <div className="absolute -inset-2 bg-linear-to-br from-neutral-200/0 via-neutral-200/10 to-neutral-200/0 dark:from-neutral-800/0 dark:via-neutral-800/10 dark:to-neutral-800/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <Card className="relative overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 h-full group-hover:shadow-xl">
      {/* Анимированная сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.03)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(0,0,0,0.03)_50%,transparent_51%)] dark:bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-size-[40px_40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Мини-иконки вокруг */}
      <div className="absolute -top-3 -right-3 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <div className="relative w-full h-full">
          {service.miniIcons?.map((Icon, idx) => (
            <Icon 
              key={idx} 
              className="absolute w-4 h-4 text-neutral-900 dark:text-neutral-100"
              style={{
                top: `${Math.sin(idx) * 30 + 30}%`,
                left: `${Math.cos(idx) * 30 + 30}%`,
              }}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-500 ${
            isHovered ? 'scale-110 rotate-3' : ''
          }`}>
            <div className="relative">
              {service.icon}
              <div className="absolute -inset-3 rounded-full bg-neutral-900/5 dark:bg-neutral-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="px-4 py-2 rounded-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-300 shadow-sm">
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{service.equipmentCount}+</span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-500">единиц</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-px bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
              {service.category}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-300 leading-tight">
            {service.name}
          </h3>
        </div>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300 leading-relaxed">
          {service.description}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-500">
            <span>Технические характеристики:</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{service.stats}</span>
          </div>
          
          <ul className="space-y-3">
            {service.features.map((feature, idx) => (
              <li 
                key={idx}
                className="flex items-center gap-3 text-sm transition-all duration-300 group-hover:translate-x-2 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 group-hover:scale-150 transition-transform duration-300" />
                  <div className="absolute -inset-2 rounded-full bg-neutral-900/10 dark:bg-neutral-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-neutral-700 dark:text-neutral-300 flex-1">{feature.name}</span>
                {feature.value && (
                  <span className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                    {feature.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock className="w-4 h-4" />
              <span>Подготовка: {service.prepTime}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="group-hover:bg-neutral-900 dark:group-hover:bg-neutral-100 group-hover:text-white dark:group-hover:text-black transition-all duration-300"
            >
              <span className="mr-2">Детали</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Типы услуг
interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  miniIcons?: any[];
  features: { name: string; value?: string }[];
  equipmentCount?: number;
  prepTime: string;
  stats: string;
}

const services: Service[] = [
  {
    id: 1,
    name: 'Концертные аудиосистемы',
    description: 'Полный цикл звукового сопровождения мероприятий от настройки до финального микса. Профессиональное оборудование мировых брендов.',
    category: 'Аудио',
    icon: <Volume2 className="w-10 h-10 text-neutral-900 dark:text-neutral-100" />,
    miniIcons: [Speaker, VolumeX, Mic2, Headphones],
    features: [
      { name: 'Линейные массивы', value: '20kW+' },
      { name: 'Цифровые микшеры', value: '48 каналов' },
      { name: 'Радиомикрофоны', value: 'UHF диапазон' },
      { name: 'Мониторные системы', value: '12 зон' }
    ],
    equipmentCount: 156,
    prepTime: '4-6 часов',
    stats: 'До 120dB, 20-20кГц'
  },
  {
    id: 2,
    name: 'Световое оформление',
    description: 'Современные световые решения для создания атмосферы и визуальных эффектов. Программируемые системы с дистанционным управлением.',
    category: 'Свет',
    icon: <Sun className="w-10 h-10 text-neutral-900 dark:text-neutral-100" />,
    miniIcons: [Zap, Sparkles, Tv, Palette],
    features: [
      { name: 'Moving Head прожекторы', value: '400W' },
      { name: 'LED видеоэкраны', value: 'P4, 4K' },
      { name: 'Лазерные системы', value: 'RGB 5W' },
      { name: 'DMX контроллеры', value: '512 каналов' }
    ],
    equipmentCount: 92,
    prepTime: '6-8 часов',
    stats: '1000+ светильников'
  },
  {
    id: 3,
    name: 'Видео и live-трансляции',
    description: 'Профессиональное видеооборудование для съемки, обработки и трансляции мероприятий в реальном времени.',
    category: 'Видео',
    icon: <Camera className="w-10 h-10 text-neutral-900 dark:text-neutral-100" />,
    miniIcons: [Video, Film, Tv, Youtube],
    features: [
      { name: 'PTZ камеры 4K', value: '12x zoom' },
      { name: 'Видеомикшеры ATEM', value: '8 входов' },
      { name: 'Кодирующие станции', value: 'H.265' },
      { name: 'Медиасерверы', value: '4K 60fps' }
    ],
    equipmentCount: 78,
    prepTime: '8-10 часов',
    stats: 'До 8K, 60fps'
  },
  {
    id: 4,
    name: 'Сценические конструкции',
    description: 'Безопасные и надежные конструкции для любых площадок. Быстрый монтаж и профессиональный подход к каждой детали.',
    category: 'Сцена',
    icon: <Layers className="w-10 h-10 text-neutral-900 dark:text-neutral-100" />,
    miniIcons: [Grid3x3, Box, Truck, ShieldCheck],
    features: [
      { name: 'Модульные сцены', value: '3x3м секции' },
      { name: 'Трибуны трансформеры', value: '200+ мест' },
      { name: 'Подвесные фермы', value: 'до 5т' },
      { name: 'Декорационные панели', value: 'LED варианты' }
    ],
    equipmentCount: 64,
    prepTime: '12-24 часа',
    stats: 'Выдерживает 500кг/м²'
  }
];

// Иконка для Switch (коммутатора)
const SwitchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// Кастомная иконка радиовышки
const RadioTowerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

// Более разнообразное оборудование
const techEquipmentCategories = [
  {
    title: 'Сетевые решения',
    icon: <Network className="w-6 h-6" />,
    items: [
      { icon: <Router className="w-5 h-5" />, name: 'Маршрутизаторы' },
      { icon: <SwitchIcon className="w-5 h-5" />, name: 'Коммутаторы' },
      { icon: <WifiIcon className="w-5 h-5" />, name: 'Wi-Fi 6' },
      { icon: <Cable className="w-5 h-5" />, name: 'Оптоволокно' }
    ]
  },
  {
    title: 'Серверное оборудование',
    icon: <Server className="w-6 h-6" />,
    items: [
      { icon: <CpuIcon className="w-5 h-5" />, name: 'Процессоры' },
      { icon: <DatabaseIcon className="w-5 h-5" />, name: 'СУБД' },
      { icon: <HardDriveIcon className="w-5 h-5" />, name: 'SSD массивы' },
      { icon: <CircuitBoard className="w-5 h-5" />, name: 'Материнки' }
    ]
  },
  {
    title: 'Беспроводные системы',
    icon: <RadioTowerIcon className="w-6 h-6" />,
    items: [
      { icon: <Bluetooth className="w-5 h-5" />, name: 'Bluetooth 5.3' },
      { icon: <RadioIcon className="w-5 h-5" />, name: 'Радиосистемы' },
      { icon: <SatelliteDish className="w-5 h-5" />, name: 'Спутник' },
      { icon: <Signal className="w-5 h-5" />, name: 'Усилители' }
    ]
  },
  {
    title: 'Системы питания',
    icon: <BatteryCharging className="w-6 h-6" />,
    items: [
      { icon: <Power className="w-5 h-5" />, name: 'ИБП' },
      { icon: <BatteryFull className="w-5 h-5" />, name: 'Аккумуляторы' },
      { icon: <ZapIcon className="w-5 h-5" />, name: 'Генераторы' },
      { icon: <Plug className="w-5 h-5" />, name: 'Стабилизаторы' }
    ]
  }
];

const workflowSteps = [
  { 
    step: '01',
    title: 'Технический аудит',
    description: 'Анализ площадки и технических требований',
    details: ['Замеры помещения', 'Анализ электросетей', 'Проверка интернет-каналов', 'Оценка акустики'],
    icon: Settings,
    duration: '2-4 часа'
  },
  { 
    step: '02', 
    title: 'Проектирование',
    description: 'Разработка технического плана',
    details: ['3D визуализация', 'Схемы подключения', 'Расчет нагрузок', 'План размещения'],
    icon: FileText,
    duration: '1-2 дня'
  },
  { 
    step: '03', 
    title: 'Подбор оборудования',
    description: 'Комплектация под задачи мероприятия',
    details: ['Выбор производителей', 'Тестирование образцов', 'Резервирование', 'Согласование'],
    icon: Package,
    duration: '3-5 дней'
  },
  { 
    step: '04', 
    title: 'Доставка и монтаж',
    description: 'Логистика и установка на площадке',
    details: ['Транспортировка', 'Монтаж конструкций', 'Прокладка кабелей', 'Настройка позиций'],
    icon: Truck,
    duration: '6-12 часов'
  },
  { 
    step: '05', 
    title: 'Тестирование и настройка',
    description: 'Полная проверка всех систем',
    details: ['Калибровка оборудования', 'Тест производительности', 'Проверка резервов', 'Инструктаж'],
    icon: CheckCircle,
    duration: '4-8 часов'
  },
  { 
    step: '06', 
    title: 'Сопровождение',
    description: 'Техническая поддержка во время мероприятия',
    details: ['Дежурные инженеры', 'Мониторинг систем', 'Оперативное реагирование', 'Резервные решения'],
    icon: Headphones,
    duration: '24/7'
  },
];

const techStats = [
  { value: '1500+', label: 'Единиц оборудования в наличии', icon: Box, trend: 'up' },
  { value: '99.7%', label: 'Надежность систем', icon: ShieldCheck, trend: 'up' },
  { value: '45 мин', label: 'Среднее время реакции поддержки', icon: Clock, trend: 'down' },
  { value: '98%', label: 'Удовлетворенность клиентов', icon: UsersIcon, trend: 'up' },
  { value: '12 ч', label: 'Среднее время развертывания', icon: Zap, trend: 'down' },
  { value: '5 лет', label: 'Гарантия на оборудование', icon: Award, trend: 'stable' },
];

// Компонент для статистики
const TechStatCard = ({ stat, index }: { stat: any; index: number }) => (
  <div 
    className="animate-fade-in-up"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <Card className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 group hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <stat.icon className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            stat.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            stat.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            {stat.trend === 'up' ? '↑ Улучшение' : 
             stat.trend === 'down' ? '↓ Быстрее' : '→ Стабильно'}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {stat.value}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {stat.label}
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
            <span>Последнее обновление</span>
            <span className="font-medium">24.01.2024</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % techEquipmentCategories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Улучшенный прогресс-бар */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-neutral-100 dark:bg-neutral-900">
        <div 
          className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Богатый фон с анимациями */}
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        {/* Основная сетка */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.02)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(0,0,0,0.02)_50%,transparent_51%)] dark:bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.02)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.02)_50%,transparent_51%)] bg-size-[80px_80px] animate-[gridMove_120s_linear_infinite]" />
        
        {/* Анимированные линии подключения */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-neutral-300 dark:bg-neutral-700 animate-[dataTransfer_3s_linear_infinite]"
              style={{
                top: `${20 + i * 8}%`,
                left: '0%',
                right: '0%',
                animationDelay: `${i * 0.25}s`,
                width: `${80 + Math.sin(i) * 20}%`,
                marginLeft: `${Math.cos(i) * 20}%`,
              }}
            />
          ))}
        </div>

        {/* Плавающие элементы техники */}
        {Array.from({ length: 16 }).map((_, i) => {
          const icons = [Cpu, Server, Database, Router, Satellite, Radio, Cctv, HardDrive];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute opacity-5 hover:opacity-20 transition-opacity duration-1000 animate-float-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
              }}
            >
              <Icon className="w-8 h-8 text-neutral-900 dark:text-neutral-100" />
            </div>
          );
        })}
      </div>

      <main ref={containerRef} className="container mx-auto px-4 py-8 relative">
        {/* Герой-секция с обновленной структурой */}
        <section className="mb-32 pt-12">
          <div className="relative">
            {/* Анимированный фоновый элемент */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96">
              <div className="absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-800" />
              <div className="absolute inset-8 rounded-full border border-neutral-300 dark:border-neutral-700 animate-spin-slow" />
              <div className="absolute inset-16 rounded-full border border-neutral-400 dark:border-neutral-600 animate-spin-slow reverse" />
            </div>

            <div className="text-center relative">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 mb-8 animate-fade-in shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping delay-150" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping delay-300" />
                </div>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-wider">
                  ТЕХНОЛОГИЧЕСКИЕ РЕШЕНИЯ ПРЕМИУМ-КЛАССА
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 animate-fade-in-up leading-none">
                <span className="block text-neutral-900 dark:text-neutral-100">
                  ТЕХНИЧЕСКИЕ
                </span>
                <span className="block mt-4 relative">
                  <span className="relative z-10 text-neutral-900 dark:text-neutral-100">
                    УСЛУГИ
                  </span>
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl text-neutral-400 dark:text-neutral-600 font-normal">
                    ДЛЯ ИВЕНТОВ
                  </span>
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-2xl text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed animate-fade-in-up delay-200">
                  Комплексные технологические решения для мероприятий любого масштаба — от корпоративных конференций до международных фестивалей.
                </p>
                <div className="inline-flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-500 animate-fade-in-up delay-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Гарантия качества
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Полная безопасность
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Круглосуточная поддержка
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-400">
                <Link href="/catalog" className="relative group">
                  <div className="absolute -inset-4 bg-neutral-900/10 dark:bg-neutral-100/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="gap-4 relative bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-0 px-8 py-6 text-lg"
                  >
                    <span className="relative z-10">ИССЛЕДОВАТЬ КАТАЛОГ</span>
                    <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-2" />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </Button>
                </Link>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-4 border-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-950 px-8 py-6 text-lg"
                  >
                    <HeadphonesIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span>ТЕХНИЧЕСКАЯ КОНСУЛЬТАЦИЯ</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="gap-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 px-8 py-6 text-lg"
                  >
                    <FileText className="w-6 h-6" />
                    <span>СКАЧАТЬ ПРЕЗЕНТАЦИЮ</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Раздел статистики */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="w-24 h-px bg-linear-to-r from-transparent via-neutral-400 to-transparent mx-auto mb-4" />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.3em]">
                В цифрах
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              <span className="text-neutral-900 dark:text-neutral-100">НАША</span>
              <span className="block text-neutral-900 dark:text-neutral-100">ЭКСПЕРТИЗА</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Более 10 лет создаем технологическую инфраструктуру для крупнейших мероприятий
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStats.map((stat, idx) => (
              <TechStatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>
        </section>

        {/* Услуги с детализацией */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-8 mb-6">
              <div className="w-16 h-px bg-neutral-300 dark:bg-neutral-700" />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-[0.3em]">
                Ключевые направления
              </span>
              <div className="w-16 h-px bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              <span className="text-neutral-900 dark:text-neutral-100">ПРОФЕССИОНАЛЬНЫЕ</span>
              <span className="block text-neutral-900 dark:text-neutral-100">УСЛУГИ</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Полный цикл технического обеспечения — от проектирования до постпродакшн поддержки
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 200}ms` }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <AnimatedServiceCard 
                  service={service} 
                  isHovered={hoveredService === service.id}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Детальный рабочий процесс */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              <span className="text-neutral-900 dark:text-neutral-100">ТЕХНОЛОГИЧЕСКИЙ</span>
              <span className="block text-neutral-900 dark:text-neutral-100">ПРОЦЕСС</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              От идеи до реализации — 6 этапов профессионального подхода
            </p>
          </div>

          <div className="relative">
            {/* Линия процесса */}
            <div className="hidden lg:block absolute top-24 left-8 right-8 h-1 bg-linear-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workflowSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <Card className="bg-white dark:bg-black border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-500 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="text-5xl font-black text-neutral-300 dark:text-neutral-700">
                          {step.step}
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                          <step.icon className="w-8 h-8 text-neutral-900 dark:text-neutral-100" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-3 mb-6">
                        {step.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-neutral-500 dark:text-neutral-500">
                            Время выполнения:
                          </div>
                          <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {step.duration}
                          </div>
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
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-4">
                Технический парк
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                <span className="text-neutral-900 dark:text-neutral-100">КАТЕГОРИИ</span>
                <span className="block text-neutral-900 dark:text-neutral-100">ОБОРУДОВАНИЯ</span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">
                Более 50+ категорий профессиональной техники для любых задач
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-3 border-neutral-300 dark:border-neutral-700"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Пауза анимации' : 'Запуск анимации'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techEquipmentCategories.map((category, idx) => (
              <div
                key={idx}
                className={`relative transition-all duration-700 ${
                  idx === activeCategory ? 'scale-105' : 'scale-100 opacity-90'
                }`}
              >
                <Card className={`bg-white dark:bg-black border-2 ${
                  idx === activeCategory 
                    ? 'border-neutral-300 dark:border-neutral-700' 
                    : 'border-neutral-200 dark:border-neutral-800'
                } transition-all duration-500 h-full`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-xl ${
                        idx === activeCategory 
                          ? 'bg-neutral-100 dark:bg-neutral-900' 
                          : 'bg-neutral-50 dark:bg-neutral-950'
                      }`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                          {category.title}
                        </h3>
                        <div className="text-sm text-neutral-500 dark:text-neutral-500">
                          {category.items.length} основных типов
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors duration-300"
                        >
                          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        {idx === activeCategory ? (
                          <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Circle className="w-2 h-2 fill-current animate-pulse" />
                            Сейчас в работе
                          </span>
                        ) : (
                          'Доступно для аренды'
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Финальная CTA секция */}
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-black dark:to-neutral-950 border-2 border-neutral-200 dark:border-neutral-800">
            {/* Фоновые элементы */}
            <div className="absolute inset-0">
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 blur-3xl" />
            </div>
            
            {/* Анимированная сетка */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.02)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(0,0,0,0.02)_50%,transparent_51%)] dark:bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.02)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.02)_50%,transparent_51%)] bg-size-[60px_60px] animate-[gridMove_60s_linear_infinite]" />
            
            <div className="relative py-20 px-4 sm:px-8 lg:px-16">
              <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping delay-150" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-wider">
                    ИНДИВИДУАЛЬНЫЙ ПОДХОД
                  </span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
                  ГОТОВЫ СОЗДАТЬ
                  <span className="block text-neutral-900 dark:text-neutral-100">
                    УНИКАЛЬНОЕ МЕРОПРИЯТИЕ?
                  </span>
                </h2>
                
                <div className="max-w-3xl mx-auto mb-12">
                  <p className="text-2xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                    Наша команда инженеров разработает комплексное решение, 
                    учитывающее все технические нюансы и ваши бизнес-цели
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                      { icon: Settings, title: 'Технический план', desc: 'Детальный расчет всех систем' },
                      { icon: FileText, title: 'Смета проекта', desc: 'Прозрачное ценообразование' },
                      { icon: ShieldCheck, title: 'Гарантия качества', desc: 'Сертифицированное оборудование' },
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 mb-4">
                          <item.icon className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                        </div>
                        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                          {item.title}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full gap-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-0 px-10 py-6 text-lg"
                    >
                      <Calendar className="w-6 h-6" />
                      <span>ОБСУДИТЬ ПРОЕКТ</span>
                    </Button>
                  </Link>
                  
                  <Link href="/catalog" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full gap-4 border-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-950 px-10 py-6 text-lg"
                    >
                      <Globe className="w-6 h-6" />
                      <span>ПОЛНЫЙ КАТАЛОГ</span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-neutral-500 dark:text-neutral-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75" />
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150" />
                      </div>
                      <span>Онлайн-поддержка 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Ответ в течение 15 минут</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
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