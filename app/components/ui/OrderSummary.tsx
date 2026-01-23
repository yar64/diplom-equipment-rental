'use client';

import { useState } from 'react';
import { 
  Receipt, Calendar, Package, Truck, Shield, 
  CreditCard, Sparkles, Timer, BadgeCheck, Info 
} from 'lucide-react';
import Card, { CardContent } from './Card';
import Button from './Button';
import Input from './Input';

interface OrderSummaryProps {
  subtotal: number;
  servicesTotal: number;
  vatRate?: number;
  depositPercent?: number;
  rentalDays: number;
  onCheckout?: () => void;
  loading?: boolean;
}

export default function OrderSummary({
  subtotal,
  servicesTotal,
  vatRate = 0.2,
  depositPercent = 0.3,
  rentalDays,
  onCheckout,
  loading = false,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [hasPromo, setHasPromo] = useState(false);

  const vatAmount = (subtotal + servicesTotal) * vatRate;
  const totalAmount = subtotal + servicesTotal + vatAmount;
  const depositAmount = totalAmount * depositPercent;

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setHasPromo(true);
      // В реальном приложении здесь был бы API вызов
    }
  };

  const guaranteeItems = [
    { icon: Shield, text: 'Все оборудование застраховано' },
    { icon: BadgeCheck, text: 'Гарантия качества' },
    { icon: Timer, text: 'Доставка точно в срок' },
    { icon: Sparkles, text: 'Профессиональный монтаж' },
  ];

  return (
    <Card className="sticky top-24 border-primary/20 hover:shadow-xl transition-shadow">
      <CardContent>
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Итоги аренды</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {rentalDays} {rentalDays === 1 ? 'день' : 
                rentalDays > 1 && rentalDays < 5 ? 'дня' : 'дней'}
            </p>
          </div>
        </div>

        {/* Детализация стоимости */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Оборудование</span>
            <span className="font-medium">{subtotal.toLocaleString()} ₽</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Доп. услуги</span>
            <span className="font-medium">{servicesTotal.toLocaleString()} ₽</span>
          </div>
          
          {hasPromo && (
            <div className="flex justify-between items-center text-emerald-600">
              <span>Промокод</span>
              <span className="font-medium">-5 000 ₽</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-muted-foreground">НДС {vatRate * 100}%</span>
            <span className="font-medium">{vatAmount.toLocaleString()} ₽</span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="font-semibold text-lg">Итого</span>
            <span className="text-2xl font-bold text-primary">
              {totalAmount.toLocaleString()} ₽
            </span>
          </div>
        </div>

        {/* Промокод */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Промокод
          </label>
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Введите промокод"
              className="flex-1"
              inputSize="sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={applyPromoCode}
              disabled={!promoCode.trim()}
            >
              Применить
            </Button>
          </div>
        </div>

        {/* Предоплата */}
        <div className="mb-6 p-4 bg-muted/30 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Предоплата {depositPercent * 100}%</span>
            <span className="text-lg font-bold">{depositAmount.toLocaleString()} ₽</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Остаток оплачивается после монтажа оборудования
          </p>
        </div>

        {/* Гарантии */}
        <div className="mb-6 space-y-3">
          {guaranteeItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Кнопка оформления */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
          loading={loading}
          className="shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Перейти к оформлению
        </Button>

        {/* Дополнительная информация */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Подробнее о залоге</span>
            </div>
            <span className="font-medium">50 000 ₽</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}