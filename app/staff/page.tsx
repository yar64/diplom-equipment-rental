// app/team/page.tsx
'use client';

import { useState } from 'react';
import Button from '../components/ui/Button';
import { 
  Users,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Briefcase,
  ChevronRight,
  Headphones,
  Lightbulb,
  Video,
  Settings,
  Truck,
  User,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Target,
  Award,
  Clock,
  CheckCircle,
  MapPin,
  Globe
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  experience: string;
  expertise: string[];
  bio: string;
  phone: string;
  email: string;
  icon: any;
  rating: number;
  isAvailable: boolean;
  projectsCount: number;
  location: string;
  specialties: string[];
}

export default function TeamPage() {
  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Сотрудники
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Александр Иванов',
      position: 'Технический директор',
      department: 'technical',
      experience: '15 лет в индустрии',
      expertise: ['Сценическое оборудование', 'Системная интеграция', 'Технический аудит'],
      bio: 'Более 150 реализованных проектов, включая международные фестивали и корпоративные мероприятия мирового уровня. Эксперт по комплексным техническим решениям.',
      phone: '+7 (916) 123-45-67',
      email: 'a.ivanov@equipment-rental.ru',
      icon: Settings,
      rating: 4.9,
      isAvailable: true,
      projectsCount: 156,
      location: 'Москва',
      specialties: ['Сложные проекты', 'Международные стандарты']
    },
    {
      id: 2,
      name: 'Елена Петрова',
      position: 'Старший менеджер проектов',
      department: 'sales',
      experience: '8 лет в аренде оборудования',
      expertise: ['Корпоративные мероприятия', 'Бюджетный подбор', 'Комплексные решения'],
      bio: 'Специализируется на подборе оборудования для бизнес-мероприятий любого масштаба. Помогла более 100 компаниям провести успешные мероприятия.',
      phone: '+7 (916) 234-56-78',
      email: 'e.petrova@equipment-rental.ru',
      icon: User,
      rating: 4.8,
      isAvailable: true,
      projectsCount: 89,
      location: 'Санкт-Петербург',
      specialties: ['VIP-клиенты', 'Крупные корпорации']
    },
    {
      id: 3,
      name: 'Дмитрий Смирнов',
      position: 'Главный звукорежиссер',
      department: 'audio',
      experience: '12 лет работы со звуком',
      expertise: ['Концертный звук', 'Конференц-связь', 'Студийная запись', 'Акустический дизайн'],
      bio: 'Работал на крупнейших музыкальных фестивалях страны. Специалист по премиальному аудиооборудованию ведущих мировых брендов.',
      phone: '+7 (916) 345-67-89',
      email: 'd.smirnov@equipment-rental.ru',
      icon: Headphones,
      rating: 5.0,
      isAvailable: false,
      projectsCount: 203,
      location: 'Москва',
      specialties: ['Концертный звук', 'Премиум аудио']
    },
    {
      id: 4,
      name: 'Ольга Козлова',
      position: 'Ведущий световой дизайнер',
      department: 'lighting',
      experience: '10 лет в световом дизайне',
      expertise: ['Светодиодные экраны', 'Архитектурная подсветка', 'Сценический свет', 'Динамическое освещение'],
      bio: 'Создавала световые решения для fashion-показов и театральных постановок. Разработала концепции освещения для более 100 мероприятий.',
      phone: '+7 (916) 456-78-90',
      email: 'o.kozlova@equipment-rental.ru',
      icon: Lightbulb,
      rating: 4.7,
      isAvailable: true,
      projectsCount: 112,
      location: 'Москва',
      specialties: ['Архитектурный свет', 'Световые инсталляции']
    },
    {
      id: 5,
      name: 'Михаил Волков',
      position: 'Директор по логистике',
      department: 'logistics',
      experience: '9 лет в логистике мероприятий',
      expertise: ['Срочная доставка', 'Монтаж оборудования', 'Транспортная логистика', 'Складское хозяйство'],
      bio: 'Организовал доставку оборудования для мероприятий в 12 городах России. Разработал систему оптимизации логистических процессов.',
      phone: '+7 (916) 567-89-01',
      email: 'm.volkov@equipment-rental.ru',
      icon: Truck,
      rating: 4.9,
      isAvailable: true,
      projectsCount: 345,
      location: 'Москва',
      specialties: ['Сложная логистика', 'Международные перевозки']
    },
    {
      id: 6,
      name: 'Сергей Николаев',
      position: 'Ведущий видеоинженер',
      department: 'technical',
      experience: '11 лет в видеоиндустрии',
      expertise: ['Видеопроекция', 'LED экраны', 'Стриминг мероприятий', 'VR/AR технологии'],
      bio: 'Технический директор по видео на международных конференциях. Специализируется на современных видео технологиях и инновационных решениях.',
      phone: '+7 (916) 789-01-23',
      email: 's.nikolaev@equipment-rental.ru',
      icon: Video,
      rating: 4.9,
      isAvailable: true,
      projectsCount: 134,
      location: 'Санкт-Петербург',
      specialties: ['Видеостены', 'Прямые трансляции']
    },
  ];

  const departments = [
    { id: 'all', name: 'Все специалисты', icon: Users, count: 6 },
    { id: 'technical', name: 'Инженеры', icon: Settings, count: 2 },
    { id: 'sales', name: 'Менеджеры', icon: User, count: 1 },
    { id: 'audio', name: 'Аудио-эксперты', icon: Headphones, count: 1 },
    { id: 'lighting', name: 'Свет-дизайнеры', icon: Lightbulb, count: 1 },
    { id: 'logistics', name: 'Логистика', icon: Truck, count: 1 },
  ];

  const filteredMembers = activeDepartment === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeDepartment);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Герой секция */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Команда экспертов</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Наши специалисты по оборудованию
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Профессионалы с многолетним опытом в аренде оборудования для мероприятий любого масштаба
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Фильтры */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors-smooth ${
                  activeDepartment === dept.id
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card hover:bg-accent border-border'
                }`}
              >
                <dept.icon className="w-4 h-4" />
                <span className="font-medium">{dept.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeDepartment === dept.id
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted'
                }`}>
                  {dept.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Сетка сотрудников */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div 
                key={member.id}
                className="group relative"
              >
                {/* Карточка */}
                <div className="bg-card border rounded-xl overflow-hidden hover-lift transition-smooth h-full flex flex-col">
                  {/* Верхняя часть с градиентом */}
                  <div className="relative p-6 pb-4">
                    {/* Статус доступности */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        member.isAvailable 
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${member.isAvailable ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        {member.isAvailable ? 'Доступен' : 'В работе'}
                      </div>
                    </div>
                    
                    {/* Основная информация */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <member.icon className="w-7 h-7 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg leading-tight mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
                        
                        {/* Рейтинг и опыт */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-semibold">{member.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            <span>{member.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Статистика */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">{member.projectsCount}</div>
                        <div className="text-xs text-muted-foreground">Проектов</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-lg font-bold">
                          <MapPin className="w-4 h-4" />
                          {member.location}
                        </div>
                        <div className="text-xs text-muted-foreground">Локация</div>
                      </div>
                    </div>

                    {/* Экспертиза */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Специализация:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.slice(0, 2).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Разделитель */}
                  <div className="px-6">
                    <div className="border-t"></div>
                  </div>

                  {/* Нижняя часть с действиями */}
                  <div className="p-6 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.slice(0, 2).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        icon={<ChevronRight className="w-4 h-4" />}
                        className="group-hover:text-primary transition-colors-smooth"
                      >
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-card border rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-5"></div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full mb-6 mx-auto">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Готовы к сотрудничеству?</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">
                Нужна помощь с оборудованием?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Наши специалисты подберут оптимальное оборудование для вашего мероприятия
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Phone className="w-5 h-5" />}
                  hoverEffect
                >
                  <a href="tel:+74951234567">Позвонить</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Mail className="w-5 h-5" />}
                  hoverEffect
                >
                  <a href="/contact">Написать сообщение</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Шапка */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                    <selectedMember.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-1">{selectedMember.name}</h3>
                    <p className="text-muted-foreground">{selectedMember.position}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{selectedMember.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedMember.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors-smooth"
                >
                  ✕
                </button>
              </div>

              {/* Контент */}
              <div className="space-y-8">
                {/* Основная информация */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Опыт работы
                      </h4>
                      <p className="text-muted-foreground">{selectedMember.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Специализация
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.specialties.map((item, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Статистика
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold mb-1">{selectedMember.projectsCount}</div>
                          <div className="text-xs text-muted-foreground">Проектов</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold mb-1">{selectedMember.rating}/5</div>
                          <div className="text-xs text-muted-foreground">Рейтинг</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Биография */}
                <div>
                  <h4 className="font-semibold mb-3">О специалисте</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Экспертиза */}
                <div>
                  <h4 className="font-semibold mb-3">Экспертиза</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedMember.expertise.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Контакты и кнопка */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Контакты</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <a 
                        href={`tel:${selectedMember.phone}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors-smooth"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Phone className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-medium">{selectedMember.phone}</span>
                      </a>
                      <a 
                        href={`mailto:${selectedMember.email}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors-smooth"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Mail className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="font-medium">{selectedMember.email}</span>
                      </a>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-4"
                    onClick={() => window.location.href = `/contact?specialist=${selectedMember.id}`}
                    icon={<MessageSquare className="w-5 h-5" />}
                    hoverEffect
                  >
                    Запросить консультацию
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}