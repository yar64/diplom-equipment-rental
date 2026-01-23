// app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Building,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Headphones,
  Video,
  Music,
  Lightbulb,
  Star,
  ChevronRight,
  Shield,
  Truck,
  Users,
  Zap
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message: string;
  equipment: string[];
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
    equipment: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  const equipmentOptions = [
    { id: 'audio', label: 'Аудио оборудование', icon: Music },
    { id: 'lighting', label: 'Световое оборудование', icon: Lightbulb },
    { id: 'video', label: 'Видеопроекция', icon: Video },
    { id: 'stage', label: 'Сценическое оборудование', icon: Headphones },
  ];

  const eventTypes = [
    'Корпоративное мероприятие',
    'Свадьба',
    'Конференция',
    'Концерт',
    'Фестиваль',
    'Выставка',
    'Частное мероприятие',
    'Другое'
  ];

  const contactPoints = [
    { icon: Phone, title: 'Экспресс-заявка', value: '+7 (495) 123-45-67', color: 'text-blue-500' },
    { icon: Mail, title: 'Email для предложений', value: 'partners@equipment-rental.ru', color: 'text-purple-500' },
    { icon: Clock, title: 'Срочная поддержка', value: 'support@equipment-rental.ru', color: 'text-green-500' },
  ];

  const advantages = [
    { icon: Shield, title: 'Гарантия качества', desc: 'Все оборудование проверено' },
    { icon: Truck, title: 'Бесплатная доставка', desc: 'При заказе от 50 000₽' },
    { icon: Users, title: 'Техническая поддержка', desc: 'На всем протяжении мероприятия' },
    { icon: Zap, title: 'Быстрый ответ', desc: 'В течение 15 минут' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Форма отправлена:', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        message: '',
        equipment: []
      });
    } catch (err) {
      setError('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(id => id !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Левая колонка скелетоны */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-card border rounded-2xl p-6">
                  <div className="h-8 bg-gray-200 rounded mb-6 w-3/4"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 rounded-xl border animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Центральная колонка скелетон */}
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-2xl p-8">
                  <div className="h-10 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-8 w-3/4"></div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-40 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Герой-секция */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Профессиональная аренда</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Свяжитесь с нами для
              <span className="block text-primary">идеального мероприятия</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Расскажите о вашем мероприятии, и мы подберем оборудование, которое сделает его незабываемым
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Основная сетка */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Левая колонка - Быстрые контакты */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            {/* Контактные точки */}
            <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Быстрая связь</h2>
              <div className="space-y-3 md:space-y-4">
                {contactPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="p-3 md:p-4 rounded-lg md:rounded-xl border border-border hover-lift transition-smooth group cursor-pointer"
                    onClick={() => window.location.href = point.icon === Phone ? `tel:${point.value.replace(/\D/g, '')}` : `mailto:${point.value}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 md:p-3 rounded-lg ${point.color === 'text-blue-500' ? 'bg-blue-500/10' : point.color === 'text-purple-500' ? 'bg-purple-500/10' : 'bg-green-500/10'}`}>
                        <point.icon className={`w-4 h-4 md:w-5 md:h-5 ${point.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base mb-1">{point.title}</h3>
                        <p className="text-muted-foreground text-xs md:text-sm">{point.value}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors-smooth" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Преимущества */}
            <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Наши преимущества</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="p-3 md:p-4 rounded-lg bg-background border border-border text-center">
                    <div className="flex justify-center mb-2 md:mb-3">
                      <div className="p-2 md:p-3 rounded-full bg-primary/10">
                        <advantage.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-xs md:text-sm mb-1">{advantage.title}</h3>
                    <p className="text-muted-foreground text-xs">{advantage.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Социальные сети */}
            <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Мы в соцсетях</h2>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                <a href="#" className="p-3 rounded-lg md:rounded-xl border border-border hover-lift transition-smooth flex flex-col items-center group">
                  <Facebook className="w-5 h-5 md:w-6 md:h-6 mb-2 text-blue-500" />
                  <span className="text-xs font-medium">Facebook</span>
                </a>
                <a href="#" className="p-3 rounded-lg md:rounded-xl border border-border hover-lift transition-smooth flex flex-col items-center group">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 mb-2 text-pink-500" />
                  <span className="text-xs font-medium">Instagram</span>
                </a>
                <a href="#" className="p-3 rounded-lg md:rounded-xl border border-border hover-lift transition-smooth flex flex-col items-center group">
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6 mb-2 text-blue-600" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </a>
                <a href="#" className="p-3 rounded-lg md:rounded-xl border border-border hover-lift transition-smooth flex flex-col items-center group">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 mb-2 text-green-500" />
                  <span className="text-xs font-medium">Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Центральная колонка - Форма */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl md:rounded-2xl p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-8 md:py-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-green-500/10 animate-pulse">
                      <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Заявка принята!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
                    Наш менеджер свяжется с вами в течение 15 минут для уточнения деталей
                    и подготовки индивидуального предложения.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setIsSubmitted(false)}
                    hoverEffect
                    className="px-6 md:px-8"
                  >
                    Отправить новую заявку
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Заполните заявку</h2>
                    <p className="text-muted-foreground text-sm md:text-base">
                      Ответим в течение 15 минут и подготовим индивидуальное предложение
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {/* Основная информация */}
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                      <Input
                        label="Ваше имя *"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        icon={<User className="w-4 h-4" />}
                        animateOnFocus
                        className="border-border"
                      />
                      
                      <Input
                        label="Email *"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        icon={<Mail className="w-4 h-4" />}
                        animateOnFocus
                        className="border-border"
                      />
                      
                      <Input
                        label="Телефон *"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        icon={<Phone className="w-4 h-4" />}
                        animateOnFocus
                        className="border-border"
                      />
                    </div>

                    {/* Тип мероприятия */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Тип мероприятия *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                        {eventTypes.map((type, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData({...formData, eventType: type})}
                            className={`px-3 py-2 md:px-4 md:py-3 rounded-lg border border-border text-xs md:text-sm font-medium transition-colors-smooth ${
                              formData.eventType === type 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Оборудование */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Какое оборудование интересует? (можно выбрать несколько)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                        {equipmentOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleEquipmentToggle(item.id)}
                            className={`p-3 md:p-4 rounded-lg md:rounded-xl border border-border flex flex-col items-center gap-2 transition-all ${
                              formData.equipment.includes(item.id)
                                ? 'bg-primary/10 border-primary' 
                                : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <div className={`p-2 md:p-3 rounded-lg ${
                              formData.equipment.includes(item.id)
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-center">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Сообщение */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Детали мероприятия *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none text-sm md:text-base"
                        placeholder="Дата, место, количество гостей, особые пожелания..."
                      />
                    </div>

                    {/* Отправка */}
                    <div className="pt-4 border-t border-border">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 md:py-4 text-base md:text-lg font-semibold"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={<Send className="w-4 h-4 md:w-5 md:h-5" />}
                        hoverEffect
                      >
                        {isSubmitting ? 'Отправка...' : 'Получить предложение'}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Карта отделений под формой */}
            <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">Москва</h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-2">ул. Примерная, д. 1</p>
                <p className="text-xs md:text-sm text-muted-foreground">+7 (495) 123-45-67</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs md:text-sm text-muted-foreground">Склад: 5000+ единиц оборудования</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">Санкт-Петербург</h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-base mb-2">пр. Тестовый, д. 15</p>
                <p className="text-xs md:text-sm text-muted-foreground">+7 (812) 987-65-43</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs md:text-sm text-muted-foreground">Склад: 3000+ единиц оборудования</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="max-w-6xl mx-auto mt-12 md:mt-16">
          <div className="bg-card border border-border rounded-xl md:rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Наша статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold mb-2">1500+</div>
                <p className="text-muted-foreground text-xs md:text-sm">Проведенных мероприятий</p>
              </div>
              <div className="text-center p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold mb-2">24/7</div>
                <p className="text-muted-foreground text-xs md:text-sm">Техническая поддержка</p>
              </div>
              <div className="text-center p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold mb-2">98%</div>
                <p className="text-muted-foreground text-xs md:text-sm">Довольных клиентов</p>
              </div>
              <div className="text-center p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold mb-2">12</div>
                <p className="text-muted-foreground text-xs md:text-sm">Городов присутствия</p>
              </div>
            </div>
          </div>
        </div>

        {/* Процесс работы */}
        <div className="max-w-6xl mx-auto mt-8 md:mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Как мы работаем</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { step: '01', title: 'Заявка', desc: 'Вы оставляете заявку с деталями мероприятия' },
              { step: '02', title: 'Консультация', desc: 'Менеджер связывается для уточнения деталей' },
              { step: '03', title: 'Предложение', desc: 'Подготавливаем индивидуальное предложение' },
              { step: '04', title: 'Договор', desc: 'Заключаем договор и вносим предоплату' },
              { step: '05', title: 'Доставка', desc: 'Доставляем и устанавливаем оборудование' },
              { step: '06', title: 'Поддержка', desc: 'Обеспечиваем техническую поддержку' },
            ].map((item, index) => (
              <div key={index} className="p-4 md:p-6 rounded-lg md:rounded-xl border border-border bg-card hover-lift transition-smooth">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="font-bold text-sm md:text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Глобальные стили */}
      <style jsx global>{`
        .transition-smooth {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .transition-colors-smooth {
          transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}