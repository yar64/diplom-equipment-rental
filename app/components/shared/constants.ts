import { 
  Search, Menu, ShoppingCart, Heart, User, ChevronRight, Star, 
  Shield, Truck, Clock, Phone, Music, Video, Lightbulb, Theater,
  Headphones, Projector, Sparkles, CheckCircle, Zap, Users, Award,
  Mic, Monitor, Sun, Globe, Volume2, Film
} from 'lucide-react';
import React from 'react';

// Категории оборудования
export const equipmentCategories = [
  { 
    id: 1, 
    name: 'Аудио оборудование', 
    icon: React.createElement(Mic, { className: "w-6 h-6" }), 
    count: 42 
  },
  { 
    id: 2, 
    name: 'Видео техника', 
    icon: React.createElement(Monitor, { className: "w-6 h-6" }), 
    count: 28 
  },
  { 
    id: 3, 
    name: 'Осветительное оборудование', 
    icon: React.createElement(Sun, { className: "w-6 h-6" }), 
    count: 35 
  },
  { 
    id: 4, 
    name: 'Сценическое оборудование', 
    icon: React.createElement(Theater, { className: "w-6 h-6" }), 
    count: 19 
  },
  { 
    id: 5, 
    name: 'Звуковое оборудование', 
    icon: React.createElement(Volume2, { className: "w-6 h-6" }), 
    count: 31 
  },
  { 
    id: 6, 
    name: 'Проекционное оборудование', 
    icon: React.createElement(Film, { className: "w-6 h-6" }), 
    count: 24 
  },
];

// Популярное оборудование
export const popularEquipment = [
  { 
    id: 1, 
    name: 'Профессиональный микшерный пульт Yamaha CL5', 
    price: '1 500', period: 'день', rating: 4.8, reviews: 124, 
    category: 'Аудио', badge: 'Хит сезона' 
  },
  { 
    id: 2, 
    name: 'LED панель 55" 4K Samsung QLED', 
    price: '2 500', period: 'день', rating: 4.9, reviews: 89, 
    category: 'Видео', badge: 'Новинка' 
  },
  { 
    id: 3, 
    name: 'Прожектор Moving Head Beam 400W', 
    price: '1 800', period: 'день', rating: 4.7, reviews: 67, 
    category: 'Освещение', badge: 'Популярное' 
  },
  { 
    id: 4, 
    name: 'Акустическая система JBL SRX 2000W', 
    price: '2 200', period: 'день', rating: 4.9, reviews: 156, 
    category: 'Аудио', badge: 'Лучший выбор' 
  },
];

// Преимущества
export const features = [
  {
    icon: React.createElement(Truck, { className: "w-7 h-7" }),
    title: 'Мгновенная доставка',
    description: 'Доставка за 3 часа по Москве. Работаем 24/7 для ваших срочных мероприятий',
    accent: 'bg-primary text-primary-foreground'
  },
  {
    icon: React.createElement(Shield, { className: "w-7 h-7" }),
    title: 'Гарантия EventPro',
    description: 'Каждое оборудование проходит 17-этапную проверку перед отправкой',
    accent: 'bg-secondary text-secondary-foreground'
  },
  {
    icon: React.createElement(Clock, { className: "w-7 h-7" }),
    title: 'Гибкая аренда',
    description: 'Арендуйте от 3 часов до года. Специальные тарифы для ивент-агентств',
    accent: 'bg-accent text-accent-foreground'
  },
  {
    icon: React.createElement(Zap, { className: "w-7 h-7" }),
    title: 'Поддержка экспертов',
    description: 'Наши инженеры помогут с настройкой и будут на связи во время мероприятия',
    accent: 'bg-muted text-muted-foreground'
  },
];

// Отзывы
export const testimonials = [
  {
    name: 'Александр Петров',
    role: 'Организатор фестивалей',
    text: 'EventRent стал нашим стратегическим партнером. Благодаря их оборудованию и поддержке мы провели самые масштабные мероприятия сезона.',
    rating: 5,
    initials: 'АП'
  },
  {
    name: 'Марина Иванова',
    role: 'Event-директор агентства',
    text: 'Работаем 2 года - ни одной проблемы. Их инженеры всегда на связи, даже в ночь перед мероприятием. Это бесценно!',
    rating: 5,
    initials: 'МИ'
  },
  {
    name: 'Дмитрий Сидоров',
    role: 'Владелец сети клубов',
    text: 'Лучшее соотношение цена/качество на рынке. Техника всегда в идеальном состоянии, как новая.',
    rating: 4,
    initials: 'ДС'
  },
];

// Статистика
export const statistics = [
  { 
    value: '850+', 
    label: 'Единиц оборудования', 
    icon: React.createElement(Award, { className: "w-6 h-6" }) 
  },
  { 
    value: '2 400+', 
    label: 'Довольных клиентов', 
    icon: React.createElement(Users, { className: "w-6 h-6" }) 
  },
  { 
    value: '98%', 
    label: 'Положительных отзывов', 
    icon: React.createElement(CheckCircle, { className: "w-6 h-6" }) 
  }
];

// Контактная информация
export const contactInfo = [
  { icon: '📍', text: 'г. Москва, ул. Примерная, 123' },
  { icon: '📞', text: '+7 (999) 123-45-67' },
  { icon: '✉️', text: 'info@eventrent.ru' },
  { icon: '⏰', text: 'Ежедневно 9:00 - 21:00' }
];

// Навигационные ссылки
export const navLinks = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Услуги', href: '/services' },
  { label: 'О компании', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
];

// Опции цен
export const priceOptions = [
  { value: '', label: 'Любая цена' },
  { value: '0-1000', label: 'до 1 000₽/день' },
  { value: '1000-3000', label: '1 000-3 000₽/день' },
  { value: '3000-5000', label: '3 000-5 000₽/день' },
  { value: '5000+', label: 'от 5 000₽/день' }
];