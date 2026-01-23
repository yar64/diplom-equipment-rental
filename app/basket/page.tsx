// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, ArrowLeft, Clock, 
  Package, Truck, Wrench, Shield, Headphones,
  Calendar, Users, MapPin, FileText, Zap
} from 'lucide-react';
import CartItem from '../components/ui/CartItem';
import EventTypeSelector from '../components/ui/EventTypeSelector';
import ServiceToggle from '../components/ui/ServiceToggle';
import PowerRequirements from '../components/ui/PowerRequirements';
import OrderSummary from '../components/ui/OrderSummary';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';

const MOCK_SERVICES = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Доставка и подъём',
    description: 'Курьерская доставка до адреса и подъём на этаж',
    price: 5000,
    options: [
      { label: 'Стандарт (до подъезда)', price: 3000, description: 'Разгрузка у входа' },
      { label: 'Комплекс (подъём на этаж)', price: 5000, description: 'С подъёмом в помещение' },
      { label: 'Самовывоз со склада', price: 0, description: 'Заберете самостоятельно' },
    ]
  },
  {
    id: 'setup',
    icon: Wrench,
    title: 'Монтаж и настройка',
    description: 'Профессиональная установка и настройка оборудования',
    price: 10000,
    required: true,
  },
  {
    id: 'insurance',
    icon: Shield,
    title: 'Расширенная страховка',
    description: 'Полное покрытие рисков на время аренды',
    price: 3000,
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Техническая поддержка',
    description: 'Дежурный техник на время мероприятия',
    price: 15000,
  },
];

const MOCK_CART_ITEMS = [
  {
    id: '1',
    name: 'Концертная акустика JBL VRX915',
    category: 'Аудио оборудование',
    dailyPrice: 8000,
    quantity: 2,
    rentalDates: {
      start: '15 апр 2024',
      end: '17 апр 2024',
      days: 3,
    },
    totalPrice: 48000,
    inStock: true,
  },
  {
    id: '2',
    name: 'LED-экран P4 6x3м с обработкой',
    category: 'Видео оборудование',
    dailyPrice: 25000,
    quantity: 1,
    rentalDates: {
      start: '15 апр 2024',
      end: '17 апр 2024',
      days: 3,
    },
    totalPrice: 75000,
    inStock: true,
  },
  {
    id: '3',
    name: 'Прожекторы Clay Paky A.leda B-EYE K20',
    category: 'Световое оборудование',
    dailyPrice: 4000,
    quantity: 12,
    rentalDates: {
      start: '14 апр 2024',
      end: '18 апр 2024',
      days: 5,
    },
    totalPrice: 240000,
    inStock: true,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [selectedServices, setSelectedServices] = useState<Record<string, { enabled: boolean; option?: string }>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
  });

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: item.dailyPrice * quantity * item.rentalDates.days }
        : item
    ));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Симуляция API вызова
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const servicesTotal = Object.entries(selectedServices)
    .filter(([_, data]) => data.enabled)
    .reduce((sum, [id]) => {
      const service = MOCK_SERVICES.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);

  const rentalDays = Math.max(...cartItems.map(item => item.rentalDates.days));

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Корзина пуста</h2>
          <p className="text-muted-foreground mb-8">
            Добавьте оборудование из каталога для аренды
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => router.push('/catalog')}
          >
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Корзина аренды</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Бронь сохраняется на 24 часа
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
          </div>

          {/* Индикатор прогресса */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                1
              </div>
              <span className="font-medium">Корзина</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                2
              </div>
              <span>Оформление</span>
            </div>
            <div className="h-px w-8 bg-border"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                3
              </div>
              <span>Подтверждение</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Левая колонка - Основное содержимое */}
          <div className="lg:col-span-2 space-y-8">
            {/* Тип мероприятия */}
            <EventTypeSelector />

            {/* Оборудование в корзине */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    Оборудование ({cartItems.length})
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} единиц
                  </span>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/catalog')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Добавить еще оборудование
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Дополнительные услуги */}
            <ServiceToggle
              services={MOCK_SERVICES}
              onChange={setSelectedServices}
            />

            {/* Требования к электропитанию */}
            <PowerRequirements />

            {/* Контактные данные */}
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Контактные данные
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Input
                    label="ФИО контактного лица"
                    placeholder="Иванов Иван Иванович"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  />
                  <Input
                    label="Телефон"
                    placeholder="+7 (999) 999-99-99"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="ivanov@example.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  />
                  <Input
                    label="Название компании"
                    placeholder="ООО 'Пример'"
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Адрес мероприятия
                  </h4>
                  <Input
                    placeholder="г. Москва, ул. Примерная, д. 1"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">
                        На этот адрес будут отправлены все документы по аренде
                        и контактные данные ответственного менеджера
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - Итоги */}
          <div>
            <OrderSummary
              subtotal={subtotal}
              servicesTotal={servicesTotal}
              rentalDays={rentalDays}
              onCheckout={handleCheckout}
              loading={isCheckingOut}
            />
            
            {/* Быстрые подсказки */}
            <Card className="mt-6">
              <CardContent>
                <h4 className="font-semibold mb-4">Как это работает</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <p className="text-sm">Оформляете заявку на сайте</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <p className="text-sm">Менеджер свяжется для подтверждения</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <p className="text-sm">Вносите предоплату 30%</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <p className="text-sm">Получаете оборудование в указанный день</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}