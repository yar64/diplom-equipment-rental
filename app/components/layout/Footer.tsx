import Link from 'next/link';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook, 
  Instagram, 
  Youtube,
  Twitter,
  ArrowRight,
  CreditCard,
  Truck,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Send,
  Users,
  Download,
  FileText,
  HelpCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { equipmentCategories, contactInfo } from '../shared/constants';

export default function Footer() {
  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'Mir', icon: '💳' },
    { name: 'СБП', icon: '📱' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', href: '#' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: '#' },
    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', href: '#' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', href: '#' },
  ];

  const companyLinks = [
    { label: 'О компании', href: '/about' },
    { label: 'Блог', href: '/blog' },
    { label: 'Отзывы', href: '/reviews' },
    { label: 'Вакансии', href: '/careers' },
    { label: 'Партнеры', href: '/partners' },
    { label: 'Документы', href: '/documents' },
  ];

  const serviceLinks = [
    { label: 'Доставка и установка', href: '/delivery' },
    { label: 'Монтаж и демонтаж', href: '/installation' },
    { label: 'Техподдержка', href: '/support' },
    { label: 'Гарантия', href: '/warranty' },
    { label: 'Аренда с оператором', href: '/with-operator' },
    { label: 'Консультация', href: '/consultation' },
  ];

  const helpLinks = [
    { label: 'Частые вопросы', href: '/faq', icon: HelpCircle },
    { label: 'Документация', href: '/docs', icon: FileText },
    { label: 'Инструкции', href: '/guides', icon: Download },
    { label: 'Сообщество', href: '/community', icon: Users },
  ];

  // Функция для создания slug из названия
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  return (
    <footer className="bg-linear-to-b from-background to-gray-50/50 dark:to-gray-900/50 border-t border-border">
      {/* Главная секция */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Преимущества - адаптивная сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-16">
          <div className="bg-card border rounded-lg lg:rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
              <Truck className="w-8 h-8 lg:w-10 lg:h-10 text-primary mb-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1 lg:mb-2">Быстрая доставка</h3>
                <p className="text-sm lg:text-base text-muted-foreground">Доставка в день заказа по Москве и области</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg lg:rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
              <CreditCard className="w-8 h-8 lg:w-10 lg:h-10 text-primary mb-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1 lg:mb-2">Гибкая оплата</h3>
                <p className="text-sm lg:text-base text-muted-foreground">Любые способы оплаты, рассрочка 0%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg lg:rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
              <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-primary mb-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1 lg:mb-2">Гарантия качества</h3>
                <p className="text-sm lg:text-base text-muted-foreground">Все оборудование регулярно обслуживается</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg lg:rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:text-center">
              <MessageSquare className="w-8 h-8 lg:w-10 lg:h-10 text-primary mb-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1 lg:mb-2">24/7 Поддержка</h3>
                <p className="text-sm lg:text-base text-muted-foreground">Круглосуточная техническая поддержка</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-8 lg:mb-16">
          {/* Лого и описание - на мобильных полная ширина */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-primary to-primary/70 text-primary-foreground rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">EventRent</h2>
                <p className="text-xs lg:text-sm text-muted-foreground">Профессионалы в организации мероприятий</p>
              </div>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground mb-6 lg:mb-8 leading-relaxed">
              Более 6 лет создаем незабываемые мероприятия по всей России. 
              Современное оборудование, профессиональная команда и индивидуальный подход к каждому клиенту.
            </p>
            
            {/* Форма подписки */}
            <div className="mb-6 lg:mb-8">
              <h3 className="font-semibold text-foreground mb-3 lg:mb-4">Подпишитесь на новости</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm lg:text-base"
                />
                <button className="px-4 lg:px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <span className="hidden sm:inline">Подписаться</span>
                  <span className="sm:hidden">OK</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Отправляя email, вы соглашаетесь с политикой конфиденциальности
              </p>
            </div>

            {/* Социальные сети */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 lg:mb-4">Мы в соцсетях</h3>
              <div className="flex gap-2 lg:gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-8 h-8 lg:w-10 lg:h-10 border border-input rounded-lg flex items-center justify-center hover:bg-accent hover:border-primary/30 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Навигационные колонки - на мобильных аккордеон или сетка */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12">
            <div>
              <h4 className="font-semibold text-foreground mb-4 lg:mb-6 text-lg pb-2 lg:pb-3 border-b border-border flex items-center justify-between lg:justify-start">
                Категории
                <ChevronRight className="lg:hidden w-5 h-5" />
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {equipmentCategories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      href={`/catalog/${createSlug(cat.name)}`}
                      className="text-sm lg:text-base text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-primary/0 group-hover:bg-primary rounded-full mr-3 transition-colors hidden lg:block"></span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 lg:mb-6 text-lg pb-2 lg:pb-3 border-b border-border flex items-center justify-between lg:justify-start">
                Услуги
                <ChevronRight className="lg:hidden w-5 h-5" />
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {serviceLinks.slice(0, 6).map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      href={link.href}
                      className="text-sm lg:text-base text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-primary/0 group-hover:bg-primary rounded-full mr-3 transition-colors hidden lg:block"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 lg:mb-6 text-lg pb-2 lg:pb-3 border-b border-border flex items-center justify-between lg:justify-start">
                Компания
                <ChevronRight className="lg:hidden w-5 h-5" />
              </h4>
              <ul className="space-y-2 lg:space-y-4">
                {companyLinks.slice(0, 6).map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      href={link.href}
                      className="text-sm lg:text-base text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-primary/0 group-hover:bg-primary rounded-full mr-3 transition-colors hidden lg:block"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="border-t border-border pt-8 lg:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lg:mb-2">Телефон</h4>
                <a href="tel:+78001234567" className="text-base lg:text-lg font-medium text-foreground hover:text-primary transition-colors">
                  8 (800) 123-45-67
                </a>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Бесплатный звонок по России</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lg:mb-2">Email</h4>
                <a href="mailto:info@eventrent.ru" className="text-base lg:text-lg font-medium text-foreground hover:text-primary transition-colors">
                  info@eventrent.ru
                </a>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Ответим в течение часа</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lg:mb-2">Адрес</h4>
                <p className="text-base lg:text-lg font-medium text-foreground">
                  Москва, ул. Пушкина, д. 1
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Ежедневно с 9:00 до 21:00</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lg:mb-2">Режим работы</h4>
                <p className="text-base lg:text-lg font-medium text-foreground">
                  Круглосуточно
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">Прием заказов онлайн 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-6 text-xs lg:text-sm text-muted-foreground order-3 lg:order-1">
              <p>© 2024 EventRent. Все права защищены.</p>
              <div className="flex items-center gap-4 lg:gap-6">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Пользовательское соглашение
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 order-2 lg:order-2">
              <span className="text-xs lg:text-sm text-muted-foreground">Принимаем к оплате:</span>
              <div className="flex gap-1 lg:gap-2">
                {paymentMethods.map((method, idx) => (
                  <div 
                    key={idx}
                    className="w-8 h-6 lg:w-10 lg:h-6 bg-background border rounded flex items-center justify-center text-xs"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-xs lg:text-sm text-muted-foreground text-center sm:text-left order-1 lg:order-3">
              <p>ИНН 1234567890 • ОГРН 1234567890123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная мобильная информация */}
      <div className="lg:hidden border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">1500+</div>
              <div className="text-xs text-muted-foreground">единиц оборудования</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-xs text-muted-foreground">специалистов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">100+</div>
              <div className="text-xs text-muted-foreground">реализованных проектов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-xs text-muted-foreground">техподдержка</div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые ссылки для мобильных */}
      <div className="lg:hidden border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="/contact" 
              className="flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Заказать звонок
            </Link>
            <Link 
              href="/catalog" 
              className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Star className="w-4 h-4" />
              Каталог
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}