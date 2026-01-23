// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import NotificationToggle from '../components/ui/NotificationToggle';
import ProfileAvatar from '../components/ui/ProfileAvatar';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  History,
  Settings,
  Bell,
  Shield,
  LogOut,
  Edit,
  Save,
  X,
  Star,
  Clock,
  Truck,
  Headphones,
  Lightbulb,
  Video,
  Music,
  ChevronRight,
  HelpCircle,
  Key,
  Eye,
  EyeOff,
  Building,
  Briefcase,
  ShieldCheck,
  Globe,
  DollarSign,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  Wifi,
  Zap,
  TrendingUp,
  Users,
  Award,
  FileText,
  MessageSquare
} from 'lucide-react';

// Типы данных
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  joinDate: string;
}

interface RentalItem {
  id: number;
  equipment: string;
  type: 'audio' | 'video' | 'lighting';
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  amount: number;
  period?: string;
}

interface FavoriteItem {
  id: number;
  name: string;
  type: string;
  category: string;
  price: number;
  rating: number;
}

export default function ProfilePage() {
  // Состояния
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Данные пользователя
  const [userData, setUserData] = useState<UserProfile>({
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    company: 'ООО "ТехноМир"',
    position: 'Менеджер по мероприятиям',
    location: 'г. Москва',
    joinDate: '15 марта 2023'
  });

  const [editData, setEditData] = useState<UserProfile>({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Статистика
  const stats = [
    { value: '12', label: 'Всего аренд', icon: <Package className="w-6 h-6" /> },
    { value: '156 800 ₽', label: 'Общая сумма', icon: <DollarSign className="w-6 h-6" /> },
    { value: '2', label: 'Активные', icon: <Clock className="w-6 h-6" /> },
    { value: '4.8', label: 'Ваш рейтинг', icon: <Star className="w-6 h-6" /> }
  ];

  // История аренд
  const rentals: RentalItem[] = [
    { id: 1, equipment: 'Профессиональная звуковая система', type: 'audio', date: '15 дек 2023', status: 'completed', amount: 45000, period: '3 дня' },
    { id: 2, equipment: 'LED экран 4x3м', type: 'video', date: '22 дек 2023', status: 'completed', amount: 32000, period: '2 дня' },
    { id: 3, equipment: 'Светодиодная подсветка сцены', type: 'lighting', date: '10 янв 2024', status: 'active', amount: 28000, period: '5 дней' },
    { id: 4, equipment: 'Радиомикрофоны (10 шт)', type: 'audio', date: '25 янв 2024', status: 'active', amount: 15000, period: '7 дней' },
  ];

  // Избранное
  const favorites: FavoriteItem[] = [
    { id: 1, name: 'Концертная звуковая система', type: 'audio', category: 'Профессиональное', price: 45000, rating: 4.8 },
    { id: 2, name: 'Светодиодный экран', type: 'video', category: 'Large Format', price: 32000, rating: 4.9 },
    { id: 3, name: 'Сценический свет', type: 'lighting', category: 'DMX управление', price: 28000, rating: 4.7 },
    { id: 4, name: 'DJ оборудование', type: 'audio', category: 'Клубное', price: 15000, rating: 4.6 },
  ];

  // Настройки уведомлений
  const notifications = [
    { id: 'email', label: 'Email уведомления', description: 'Новые предложения и обновления', defaultChecked: true },
    { id: 'delivery', label: 'Статус доставки', description: 'Обновления по доставке оборудования', defaultChecked: true },
    { id: 'promo', label: 'Акции и промокоды', description: 'Специальные предложения', defaultChecked: false },
    { id: 'reminders', label: 'Напоминания', description: 'Напоминания о возврате оборудования', defaultChecked: true },
  ];

  // Быстрые действия
  const quickActions = [
    { label: 'Новая аренда', icon: Package, href: '/catalog', description: 'Выбрать оборудование' },
    { label: 'История аренд', icon: History, href: '/rentals', description: 'Посмотреть историю' },
    { label: 'Платежи', icon: CreditCard, href: '/billing', description: 'Управление счетами' },
    { label: 'Поддержка', icon: HelpCircle, href: '/help', description: 'Помощь и FAQ' },
  ];

  // Функции
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUserData({ ...editData });
      setIsEditing(false);
      setIsLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      setIsLoading(false);
      alert('Пароль успешно изменен!');
    }, 500);
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      // Редирект на страницу входа
      window.location.href = '/login';
    }
  };

  // Вспомогательные функции
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-500/10';
      case 'completed': return 'text-blue-600 bg-blue-500/10';
      case 'cancelled': return 'text-red-600 bg-red-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  const getEquipmentIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'audio': return <Headphones className={`${iconClass} text-blue-600`} />;
      case 'video': return <Video className={`${iconClass} text-purple-600`} />;
      case 'lighting': return <Lightbulb className={`${iconClass} text-yellow-600`} />;
      default: return <Package className={`${iconClass} text-gray-600`} />;
    }
  };

  // Рендер контента в зависимости от активного таба
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  stat={stat}
                  delay={index * 100}
                  animateCount={true}
                />
              ))}
            </div>

            {/* Информация профиля */}
            <Card hoverEffect animateOnHover>
              <CardContent>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Информация профиля</h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      icon={<Edit className="w-5 h-5" />}
                      hoverEffect
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        icon={<X className="w-5 h-5" />}
                        hoverEffect
                      >
                        Отмена
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={isLoading}
                        icon={<Save className="w-5 h-5" />}
                        hoverEffect
                      >
                        Сохранить
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Имя и фамилия"
                    value={isEditing ? editData.name : userData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    disabled={!isEditing}
                    icon={<User className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={isEditing ? editData.email : userData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    disabled={!isEditing}
                    icon={<Mail className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                  
                  <Input
                    label="Телефон"
                    value={isEditing ? editData.phone : userData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    disabled={!isEditing}
                    icon={<Phone className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                  
                  <Input
                    label="Компания"
                    value={isEditing ? editData.company : userData.company}
                    onChange={(e) => setEditData({...editData, company: e.target.value})}
                    disabled={!isEditing}
                    icon={<Building className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                  
                  <Input
                    label="Должность"
                    value={isEditing ? editData.position : userData.position}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                    disabled={!isEditing}
                    icon={<Briefcase className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                  
                  <Input
                    label="Город"
                    value={isEditing ? editData.location : userData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                    disabled={!isEditing}
                    icon={<MapPin className="w-5 h-5" />}
                    animateOnFocus={isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Быстрые действия */}
            <Card hoverEffect animateOnHover>
              <CardContent>
                <h2 className="text-2xl font-bold mb-6">Быстрые действия</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-4 px-6 group"
                      icon={<action.icon className="w-5 h-5" />}
                      hoverEffect
                    >
                      <a href={action.href} className="flex items-center justify-between w-full">
                        <div className="text-left">
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {action.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'rentals':
        return (
          <Card hoverEffect animateOnHover>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Мои аренды</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    hoverEffect
                  >
                    Экспорт
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FileText className="w-4 h-4" />}
                    hoverEffect
                  >
                    Новая аренда
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {rentals.map((rental, index) => (
                  <div
                    key={rental.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-secondary group-hover:bg-primary/5 transition-colors">
                          {getEquipmentIcon(rental.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {rental.equipment}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {rental.date}
                            </span>
                            {rental.period && (
                              <span className="text-sm text-muted-foreground">
                                • {rental.period}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {rental.amount.toLocaleString()} ₽
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(rental.status)}`}>
                          {getStatusText(rental.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        hoverEffect
                      >
                        Подробнее
                      </Button>
                      {rental.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          hoverEffect
                        >
                          Продлить аренду
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'favorites':
        return (
          <Card hoverEffect animateOnHover>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Избранное оборудование</h2>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  hoverEffect
                >
                  Добавить
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {favorites.map((item, index) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-secondary group-hover:bg-primary/5 transition-colors">
                        {getEquipmentIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {item.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {item.rating} ⭐
                          </span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        от {item.price.toLocaleString()} ₽
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        hoverEffect
                      >
                        Арендовать снова
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          hoverEffect
                        >
                          Убрать
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          hoverEffect
                        >
                          Сравнить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card hoverEffect animateOnHover>
            <CardContent>
              <h2 className="text-2xl font-bold mb-6">Безопасность</h2>
              
              <div className="space-y-8">
                {/* Изменение пароля */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Изменение пароля</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="relative">
                      <Input
                        label="Текущий пароль"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        icon={<Key className="w-5 h-5" />}
                        animateOnFocus
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="Новый пароль"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        icon={<Key className="w-5 h-5" />}
                        animateOnFocus
                      />
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="Подтверждение пароля"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        icon={<Key className="w-5 h-5" />}
                        animateOnFocus
                      />
                    </div>
                    
                    {passwordError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-600">{passwordError}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="primary"
                        onClick={handlePasswordChange}
                        loading={isLoading}
                        hoverEffect
                      >
                        Изменить пароль
                      </Button>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Скрыть пароль
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Показать пароль
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Дополнительная безопасность */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Дополнительная безопасность</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Двухфакторная аутентификация</p>
                          <p className="text-sm text-muted-foreground">Дополнительная защита вашего аккаунта</p>
                        </div>
                        <Button
                          variant="outline"
                          icon={<ShieldCheck className="w-5 h-5" />}
                          hoverEffect
                        >
                          Включить
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">История входов</p>
                          <p className="text-sm text-muted-foreground">Последние действия в аккаунте</p>
                        </div>
                        <Button
                          variant="outline"
                          icon={<History className="w-5 h-5" />}
                          hoverEffect
                        >
                          Просмотреть
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card hoverEffect animateOnHover>
            <CardContent>
              <h2 className="text-2xl font-bold mb-6">Настройки</h2>
              
              <div className="space-y-8">
                {/* Уведомления */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Уведомления</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <NotificationToggle
                        key={notification.id}
                        id={notification.id}
                        label={notification.label}
                        description={notification.description}
                        defaultChecked={notification.defaultChecked}
                      />
                    ))}
                  </div>
                </div>

                {/* Настройки аккаунта */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Настройки аккаунта</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Язык интерфейса</p>
                            <p className="text-sm text-muted-foreground">Русский</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Валюта</p>
                            <p className="text-sm text-muted-foreground">Рубли (₽)</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Управление данными */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Управление данными</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Экспорт данных</p>
                          <p className="text-sm text-muted-foreground">Скачайте все ваши данные</p>
                        </div>
                        <Button
                          variant="outline"
                          icon={<Download className="w-5 h-5" />}
                          hoverEffect
                        >
                          Экспорт
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Удаление аккаунта</p>
                          <p className="text-sm text-muted-foreground">Полное удаление всех данных</p>
                        </div>
                        <Button
                          variant="destructive"
                          icon={<X className="w-5 h-5" />}
                          hoverEffect
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Анимированный фон */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Личный кабинет
          </h1>
          <p className="text-muted-foreground mt-2">
            Управление вашими арендами, настройками и профилем
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Левая колонка - Навигация */}
          <div className="lg:col-span-1">
            <Card hoverEffect animateOnHover className="sticky top-8">
              <CardContent>
                {/* Аватар профиля */}
                <ProfileAvatar
                  name={userData.name}
                  role={userData.company}
                  size="md"
                  editable={true}
                  onEdit={() => setIsEditing(true)}
                />

                <div className="my-6 border-t" />

                {/* Навигация */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Профиль</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rentals')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'rentals'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>Мои аренды</span>
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-6">
                      2
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'favorites'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    <span>Избранное</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'security'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Безопасность</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === 'settings'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Настройки</span>
                  </button>
                </nav>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    icon={<LogOut className="w-5 h-5" />}
                    hoverEffect
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    Выйти
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - Контент */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}