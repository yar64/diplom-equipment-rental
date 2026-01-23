// app/contact/page.tsx
'use client';

import { useState } from 'react';
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

  const contactPoints = [
    { icon: Phone, title: 'Экспресс-заявка', value: '+7 (495) 123-45-67', color: 'text-blue-400' },
    { icon: Mail, title: 'Email для предложений', value: 'partners@equipment-rental.ru', color: 'text-purple-400' },
    { icon: Clock, title: 'Срочная поддержка', value: 'support@equipment-rental.ru', color: 'text-green-400' },
  ];

  const advantages = [
    { icon: Shield, title: 'Гарантия качества', desc: 'Все оборудование проверено' },
    { icon: Truck, title: 'Бесплатная доставка', desc: 'При заказе от 50 000₽' },
    { icon: Users, title: 'Техническая поддержка', desc: 'На всем протяжении мероприятия' },
    { icon: Zap, title: 'Быстрый ответ', desc: 'В течение 15 минут' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Герой-секция */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Профессиональная аренда</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Свяжитесь с нами для
              <span className="block text-primary">идеального мероприятия</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Расскажите о вашем мероприятии, и мы подберем оборудование, которое сделает его незабываемым
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Основная сетка */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Левая колонка - Быстрые контакты */}
          <div className="lg:col-span-1 space-y-8">
            {/* Контактные точки */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Быстрая связь</h2>
              <div className="space-y-4">
                {contactPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border hover-lift transition-smooth group cursor-pointer"
                    onClick={() => window.location.href = `tel:${point.value}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${point.color.replace('text-', 'bg-').replace('400', '500/10')}`}>
                        <point.icon className={`w-5 h-5 ${point.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{point.title}</h3>
                        <p className="text-muted-foreground">{point.value}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors-smooth" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Преимущества */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Наши преимущества</h2>
              <div className="grid grid-cols-2 gap-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background border text-center">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <advantage.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{advantage.title}</h3>
                    <p className="text-xs text-muted-foreground">{advantage.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Социальные сети */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Мы в соцсетях</h2>
              <div className="grid grid-cols-4 gap-3">
                <a href="#" className="p-4 rounded-xl border hover-lift transition-smooth flex flex-col items-center group">
                  <Facebook className="w-6 h-6 mb-2 text-blue-500" />
                  <span className="text-xs font-medium">Facebook</span>
                </a>
                <a href="#" className="p-4 rounded-xl border hover-lift transition-smooth flex flex-col items-center group">
                  <Instagram className="w-6 h-6 mb-2 text-pink-500" />
                  <span className="text-xs font-medium">Instagram</span>
                </a>
                <a href="#" className="p-4 rounded-xl border hover-lift transition-smooth flex flex-col items-center group">
                  <Linkedin className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </a>
                <a href="#" className="p-4 rounded-xl border hover-lift transition-smooth flex flex-col items-center group">
                  <MessageCircle className="w-6 h-6 mb-2 text-green-500" />
                  <span className="text-xs font-medium">Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Центральная колонка - Форма */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-2xl p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-500/10 animate-ping-slow">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Заявка принята!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Наш менеджер свяжется с вами в течение 15 минут для уточнения деталей
                    и подготовки индивидуального предложения.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setIsSubmitted(false)}
                    hoverEffect
                    className="px-8"
                  >
                    Отправить новую заявку
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">Заполните заявку</h2>
                    <p className="text-muted-foreground">
                      Ответим в течение 15 минут и подготовим индивидуальное предложение
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Основная информация */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <Input
                        label="Ваше имя *"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        icon={<User className="w-4 h-4" />}
                        animateOnFocus
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
                      />
                      
                      <Input
                        label="Телефон *"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        icon={<Phone className="w-4 h-4" />}
                        animateOnFocus
                      />
                    </div>

                    {/* Тип мероприятия */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Тип мероприятия *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {eventTypes.map((type, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData({...formData, eventType: type})}
                            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors-smooth ${
                              formData.eventType === type 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'hover:bg-accent'
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {equipmentOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleEquipmentToggle(item.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                              formData.equipment.includes(item.id)
                                ? 'bg-primary/10 border-primary' 
                                : 'hover:bg-accent'
                            }`}
                          >
                            <div className={`p-3 rounded-lg ${
                              formData.equipment.includes(item.id)
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
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
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
                        placeholder="Дата, место, количество гостей, особые пожелания..."
                      />
                    </div>

                    {/* Отправка */}
                    <div className="pt-4 border-t">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-4 text-lg font-semibold"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={<Send className="w-5 h-5" />}
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
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Москва</h3>
                </div>
                <p className="text-muted-foreground mb-2">ул. Примерная, д. 1</p>
                <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Склад: 5000+ единиц оборудования</p>
                </div>
              </div>

              <div className="bg-card border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <MapPin className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Санкт-Петербург</h3>
                </div>
                <p className="text-muted-foreground mb-2">пр. Тестовый, д. 15</p>
                <p className="text-sm text-muted-foreground">+7 (812) 987-65-43</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Склад: 3000+ единиц оборудования</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-card border rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Наша статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2">1500+</div>
                <p className="text-muted-foreground">Проведенных мероприятий</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <p className="text-muted-foreground">Техническая поддержка</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2">98%</div>
                <p className="text-muted-foreground">Довольных клиентов</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold mb-2">12</div>
                <p className="text-muted-foreground">Городов присутствия</p>
              </div>
            </div>
          </div>
        </div>

        {/* Процесс работы */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Как мы работаем</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Заявка', desc: 'Вы оставляете заявку с деталями мероприятия' },
              { step: '02', title: 'Консультация', desc: 'Менеджер связывается для уточнения деталей' },
              { step: '03', title: 'Предложение', desc: 'Подготавливаем индивидуальное предложение' },
              { step: '04', title: 'Договор', desc: 'Заключаем договор и вносим предоплату' },
              { step: '05', title: 'Доставка', desc: 'Доставляем и устанавливаем оборудование' },
              { step: '06', title: 'Поддержка', desc: 'Обеспечиваем техническую поддержку' },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl border bg-card hover-lift transition-smooth">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                    <span className="font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}