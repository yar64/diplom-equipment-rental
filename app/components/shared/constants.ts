// app/catalog/data.ts
import React from 'react';
import { 
  Zap, Volume2, Monitor, Mic, Camera, Music, Battery, 
  TrendingUp, Shield, Star, Truck, Calendar, Clock, 
  Percent, Award, Users as UsersIcon, CheckCircle,
  Sun, Theater, Film
} from 'lucide-react';
import { PopularEquipment, Category, SortOption, Stat } from './types';

export const equipmentData: PopularEquipment[] = [
  {
    id: 1,
    name: "Профессиональная звуковая система JBL SRX835P",
    category: "Аудио",
    price: "4500",
    period: "сутки",
    rating: 4.8,
    reviews: 124,
    badge: "Популярное",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "2000W", connectivity: "XLR, Jack, Bluetooth" },
    tags: ["Премиум", "Доставка"],
    deliveryAvailable: true,
    setupIncluded: true,
    featured: true
  },
  {
    id: 2,
    name: "Светодиодный видеоэкран P4 Indoor",
    category: "Видео",
    price: "12000",
    period: "сутки",
    rating: 4.9,
    reviews: 89,
    badge: "Новинка",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
    available: true,
    specs: { resolution: "P4", connectivity: "HDMI, SDI" },
    tags: ["Высокое разрешение"],
    deliveryAvailable: true,
    setupIncluded: true,
    featured: true
  },
  {
    id: 3,
    name: "Беспроводная радиосистема Shure GLXD24",
    category: "Микрофоны",
    price: "2800",
    period: "сутки",
    rating: 4.7,
    reviews: 67,
    badge: "Беспроводное",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
    available: true,
    specs: { channels: "2", range: "100m" },
    tags: ["Профессиональное"],
    deliveryAvailable: true,
    setupIncluded: false
  },
  {
    id: 4,
    name: "Сценический прожектор Clay Paky Sharpy",
    category: "Свет",
    price: "6500",
    period: "сутки",
    rating: 4.6,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
    available: false,
    specs: { power: "189W LED" },
    tags: ["Эффекты", "Сценическое"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 5,
    name: "Конференц-система Bosch DCN-M",
    category: "Конференции",
    price: "8500",
    period: "сутки",
    rating: 4.9,
    reviews: 56,
    badge: "Бизнес",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
    available: true,
    specs: { channels: "64", connectivity: "PoE, Dante" },
    tags: ["Мультиязык"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 6,
    name: "Студийный светильник Aputure 300D",
    category: "Стриминг",
    price: "3200",
    period: "сутки",
    rating: 4.7,
    reviews: 38,
    badge: "Студийное",
    image: "https://images.unsplash.com/photo-1509650928943-1f5c2b3d3f6a?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "300W", range: "3200K-5600K" },
    tags: ["Би-цвет"],
    deliveryAvailable: false,
    setupIncluded: false
  },
  {
    id: 7,
    name: "Портативный генератор Honda EU22i",
    category: "Энергетика",
    price: "4200",
    period: "сутки",
    rating: 4.8,
    reviews: 112,
    badge: "Мобильный",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "2200W", capacity: "8ч" },
    tags: ["Тихий"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 8,
    name: "Видеомикшер Blackmagic ATEM Mini Pro",
    category: "Видео",
    price: "3800",
    period: "сутки",
    rating: 4.9,
    reviews: 94,
    badge: "Стриминг",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
    available: true,
    specs: { channels: "4", connectivity: "HDMI, USB" },
    tags: ["Профессиональное"],
    deliveryAvailable: true,
    setupIncluded: false
  },
  {
    id: 9,
    name: "DJ контроллер Pioneer DDJ-1000",
    category: "Аудио",
    price: "3500",
    period: "сутки",
    rating: 4.8,
    reviews: 78,
    badge: "Профессиональное",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
    available: true,
    specs: { channels: "4", connectivity: "USB, RCA" },
    tags: ["DJ", "Рекативный"],
    deliveryAvailable: true,
    setupIncluded: false
  },
  {
    id: 10,
    name: "Проектор Epson EB-L200F",
    category: "Видео",
    price: "5500",
    period: "сутки",
    rating: 4.7,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop",
    available: true,
    specs: { resolution: "WUXGA", connectivity: "HDMI, VGA" },
    tags: ["Яркий", "Высокое разрешение"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 11,
    name: "Лазерная установка KVANT Clubmax 3000",
    category: "Свет",
    price: "9800",
    period: "сутки",
    rating: 4.9,
    reviews: 32,
    badge: "Премиум",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "3W", connectivity: "DMX, ILDA" },
    tags: ["Профессиональное", "Эффекты"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 12,
    name: "Конденсаторный микрофон Neumann U87",
    category: "Микрофоны",
    price: "4200",
    period: "сутки",
    rating: 4.9,
    reviews: 56,
    badge: "Классика",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop",
    available: true,
    specs: { connectivity: "XLR" },
    tags: ["Студийный", "Премиум"],
    deliveryAvailable: true,
    setupIncluded: false
  },
  {
    id: 13,
    name: "Веб-камера Logitech Brio 4K",
    category: "Стриминг",
    price: "1200",
    period: "сутки",
    rating: 4.6,
    reviews: 89,
    badge: "4K",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
    available: true,
    specs: { resolution: "4K", connectivity: "USB-C" },
    tags: ["HD", "Автофокус"],
    deliveryAvailable: true,
    setupIncluded: false
  },
  {
    id: 14,
    name: "Портативная акустика Bose L1 Pro8",
    category: "Аудио",
    price: "3800",
    period: "сутки",
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "500W", connectivity: "Bluetooth, XLR" },
    tags: ["Портативная", "Компактная"],
    deliveryAvailable: true,
    setupIncluded: true
  },
  {
    id: 15,
    name: "Светодиодная панель Godox SL-200W",
    category: "Стриминг",
    price: "1800",
    period: "сутки",
    rating: 4.5,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1509650928943-1f5c2b3d3f6a?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "200W", range: "3200K-5600K" },
    tags: ["Светодиод", "Регулируемая температура"],
    deliveryAvailable: false,
    setupIncluded: false
  },
  {
    id: 16,
    name: "Источник бесперебойного питания APC Smart-UPS",
    category: "Энергетика",
    price: "2500",
    period: "сутки",
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
    available: true,
    specs: { power: "1500VA", capacity: "30мин" },
    tags: ["Бесперебойный", "Защита"],
    deliveryAvailable: true,
    setupIncluded: true
  }
];

export const categories: Category[] = [
  { id: 'all', name: 'Все категории', icon: Zap, count: 48 },
  { id: 'audio', name: 'Аудио', icon: Volume2, count: 12 },
  { id: 'video', name: 'Видео', icon: Monitor, count: 8 },
  { id: 'light', name: 'Свет', icon: Zap, count: 10 },
  { id: 'microphones', name: 'Микрофоны', icon: Mic, count: 6 },
  { id: 'streaming', name: 'Стриминг', icon: Camera, count: 5 },
  { id: 'conference', name: 'Конференции', icon: Music, count: 4 },
  { id: 'power', name: 'Энергетика', icon: Battery, count: 3 },
  { id: 'dj', name: 'DJ оборудование', icon: Music, count: 4 },
  { id: 'projection', name: 'Проекторы', icon: Monitor, count: 6 }
];

export const sortOptions: SortOption[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price-low', label: 'Цена: сначала дешевые' },
  { value: 'price-high', label: 'Цена: сначала дорогие' },
  { value: 'featured', label: 'Рекомендуемые' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'reviews', label: 'По количеству отзывов' }
];

export const stats: Stat[] = [
  { value: '48+', label: 'Единиц оборудования', icon: React.createElement(Zap, { className: "w-5 h-5" }) },
  { value: '98%', label: 'Уровень доступности', icon: React.createElement(TrendingUp, { className: "w-5 h-5" }) },
  { value: '24/7', label: 'Техническая поддержка', icon: React.createElement(Shield, { className: "w-5 h-5" }) },
  { value: '4.8/5', label: 'Средний рейтинг', icon: React.createElement(Star, { className: "w-5 h-5" }) },
  { value: '100+', label: 'Довольных клиентов', icon: React.createElement(UsersIcon, { className: "w-5 h-5" }) },
  { value: '12ч', label: 'Среднее время ответа', icon: React.createElement(CheckCircle, { className: "w-5 h-5" }) }
];

export const quickFilters = [
  { id: 'featured', label: 'Рекомендуемые', icon: 'Sparkles' },
  { id: 'available', label: 'Доступно сейчас', icon: 'Clock' },
  { id: 'delivery', label: 'С доставкой', icon: 'Truck' },
  { id: 'setup', label: 'С установкой', icon: 'Calendar' },
  { id: 'discount', label: 'Со скидкой', icon: 'Percent' }
];

export const priceRanges = [
  { id: '0-5000', label: 'До 5 000 ₽', min: 0, max: 5000 },
  { id: '5000-10000', label: '5 000 - 10 000 ₽', min: 5000, max: 10000 },
  { id: '10000-20000', label: '10 000 - 20 000 ₽', min: 10000, max: 20000 },
  { id: '20000+', label: 'От 20 000 ₽', min: 20000, max: 50000 }
];

export const availabilityOptions = [
  { id: 'available', label: 'В наличии', value: true },
  { id: 'unavailable', label: 'Под заказ', value: false }
];

export const deliveryOptions = [
  { id: 'delivery', label: 'С доставкой', value: true },
  { id: 'pickup', label: 'Самовывоз', value: false }
];

export const setupOptions = [
  { id: 'setup', label: 'С установкой', value: true },
  { id: 'no-setup', label: 'Без установки', value: false }
];

export const tagOptions = [
  { id: 'premium', label: 'Премиум', value: 'Премиум' },
  { id: 'professional', label: 'Профессиональное', value: 'Профессиональное' },
  { id: 'wireless', label: 'Беспроводное', value: 'Беспроводное' },
  { id: 'new', label: 'Новинка', value: 'Новинка' },
  { id: 'studio', label: 'Студийное', value: 'Студийное' },
  { id: 'mobile', label: 'Мобильное', value: 'Мобильное' }
];

// В конце вашего существующего constants.ts добавьте:
export const equipmentSpecs = {
  audio: ['Мощность', 'Частотный диапазон', 'Чувствительность', 'Импеданс'],
  video: ['Разрешение', 'Яркость', 'Контрастность', 'Входы/Выходы'],
  light: ['Мощность', 'Цветовая температура', 'Угол освещения', 'Управление'],
  microphones: ['Тип', 'Направленность', 'Частотный диапазон', 'Чувствительность'],
  streaming: ['Разрешение', 'Частота кадров', 'Подключение', 'Совместимость'],
  conference: ['Количество участников', 'Дальность действия', 'Подключение', 'Функции'],
  power: ['Мощность', 'Время работы', 'Входное напряжение', 'Выходные разъемы'],
  dj: ['Каналы', 'Совместимость', 'Входы/Выходы', 'Функции'],
  projection: ['Разрешение', 'Световой поток', 'Контрастность', 'Формат'],
};

export const rentalPeriods = [
  { value: 'day', label: 'Сутки', multiplier: 1 },
  { value: 'week', label: 'Неделя', multiplier: 5 },
  { value: 'month', label: 'Месяц', multiplier: 20 }
];

export const servicePackages = [
  {
    id: 'basic',
    name: 'Базовый',
    price: 'бесплатно',
    features: [
      'Консультация специалиста',
      'Доставка оборудования',
      'Базовый монтаж',
      'Техническая поддержка'
    ]
  },
  {
    id: 'standard',
    name: 'Стандартный',
    price: 'от 2000 ₽',
    features: [
      'Всё из Базового пакета',
      'Профессиональный монтаж',
      'Тестовый запуск',
      'Страхование оборудования'
    ]
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: 'от 5000 ₽',
    features: [
      'Всё из Стандартного пакета',
      'Круглосуточная поддержка',
      'Запасное оборудование',
      'Аварийный выезд специалиста'
    ]
  }
];

export const customerTestimonials = [
  {
    id: 1,
    name: 'Александр Иванов',
    role: 'Организатор конференции',
    text: 'Отличное оборудование и профессиональная поддержка. Всё работало без сбоев.',
    rating: 5,
    date: '15.12.2023'
  },
  {
    id: 2,
    name: 'Мария Петрова',
    role: 'Event-менеджер',
    text: 'Быстрая доставка и качественная установка. Рекомендую!',
    rating: 5,
    date: '10.12.2023'
  },
  {
    id: 3,
    name: 'Дмитрий Сидоров',
    role: 'Владелец студии',
    text: 'Регулярно арендую оборудование для съемок. Всегда в отличном состоянии.',
    rating: 4,
    date: '05.12.2023'
  }
];

export const faq = [
  {
    question: 'Как оформить аренду оборудования?',
    answer: 'Выберите нужное оборудование, укажите срок аренды и оформите заказ онлайн. Наш менеджер свяжется с вами для подтверждения.'
  },
  {
    question: 'Какие документы нужны для аренды?',
    answer: 'Для юридических лиц необходим паспорт и ИНН. Для физических лиц достаточно паспорта.'
  },
  {
    question: 'Есть ли доставка и установка?',
    answer: 'Да, мы предоставляем услуги доставки и профессиональной установки оборудования.'
  },
  {
    question: 'Что делать в случае поломки?',
    answer: 'Свяжитесь с нашей технической поддержкой. Мы оперативно заменим оборудование или отправим специалиста.'
  },
  {
    question: 'Можно ли продлить аренду?',
    answer: 'Да, аренду можно продлить при условии, что оборудование не забронировано другими клиентами.'
  },
  {
    question: 'Какие способы оплаты принимаются?',
    answer: 'Мы принимаем наличные, банковские карты, безналичный расчет для юридических лиц.'
  }
];

export const catalogContactInfo = {
  phone: '+7 (999) 123-45-67',
  email: 'info@tehnorent.ru',
  address: 'г. Москва, ул. Примерная, д. 10',
  workingHours: 'Пн-Вс: 9:00 - 21:00',
  social: {
    telegram: 'https://t.me/tehnorent',
    whatsapp: 'https://wa.me/79991234567',
    vk: 'https://vk.com/tehnorent'
  }
};

// Категории оборудования для футера
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

// Контактная информация
export const contactInfo = [
  { icon: '📍', text: 'г. Москва, ул. Примерная, 123' },
  { icon: '📞', text: '+7 (999) 123-45-67' },
  { icon: '✉️', text: 'info@eventrent.ru' },
  { icon: '⏰', text: 'Ежедневно 9:00 - 21:00' }
];

// Опции цен
export const priceOptions = [
  { value: '', label: 'Любая цена' },
  { value: '0-1000', label: 'до 1 000₽/день' },
  { value: '1000-3000', label: '1 000-3 000₽/день' },
  { value: '3000-5000', label: '3 000-5 000₽/день' },
  { value: '5000+', label: 'от 5 000₽/день' }
];

// Навигационные ссылки
export const navLinks = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Услуги', href: '/services' },
  { label: 'О компании', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
];