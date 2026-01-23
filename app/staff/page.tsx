// app/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  MapPin,
  CheckCircle,
  Award,
  Target,
  X
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
  rating: number;
  isAvailable: boolean;
  projectsCount: number;
  location: string;
  specialties: string[];
}

export default function TeamPage() {
  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isClient, setIsClient] = useState(false);

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
      expertise: ['Видеопроекция', 'LED экраны', 'Стриминг мероприятий'],
      bio: 'Технический директор по видео на международных конференциях. Специализируется на современных видео технологиях и инновационных решениях.',
      phone: '+7 (916) 789-01-23',
      email: 's.nikolaev@equipment-rental.ru',
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredMembers = activeDepartment === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === activeDepartment);

  const getDepartmentIcon = (dept: string) => {
    const deptData = departments.find(d => d.id === dept);
    return deptData ? deptData.icon : Users;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          {/* Скелетон заголовка */}
          <div className="text-center mb-12">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Скелетон фильтров */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
            ))}
          </div>

          {/* Скелетон карточек */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-14 h-14 bg-gray-300 dark:bg-gray-800 rounded-xl"></div>
                  <div className="w-20 h-8 bg-gray-300 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-4">
                  {[1, 2].map(j => (
                    <div key={j} className="h-3 bg-gray-300 dark:bg-gray-800 rounded"></div>
                  ))}
                </div>
                <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Герой секция */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 md:mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Команда экспертов</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">
            Наши специалисты по оборудованию
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Профессионалы с многолетним опытом в аренде оборудования для мероприятий любого масштаба
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 md:pb-12">
        {/* Фильтры */}
        <div className="max-w-6xl mx-auto mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg border transition-colors ${
                  activeDepartment === dept.id
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <dept.icon className="w-4 h-4" />
                <span className="font-medium text-sm md:text-base">{dept.name}</span>
                <span className={`text-xs px-1.5 md:px-2 py-0.5 rounded-full ${
                  activeDepartment === dept.id
                    ? 'bg-white/20' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {dept.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Сетка сотрудников */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredMembers.map((member) => {
              const DeptIcon = getDepartmentIcon(member.department);
              return (
                <div 
                  key={member.id}
                  className="group"
                >
                  {/* Карточка */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    {/* Верхняя часть с градиентом */}
                    <div className="relative p-4 md:p-6 pb-2 md:pb-4">
                      {/* Статус доступности */}
                      <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        <div className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          member.isAvailable 
                            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${member.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                          {member.isAvailable ? 'Доступен' : 'В работе'}
                        </div>
                      </div>
                      
                      {/* Основная информация */}
                      <div className="flex items-start gap-3 md:gap-4 mb-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <DeptIcon className="w-6 h-6 md:w-7 md:h-7 text-blue-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base md:text-lg leading-tight mb-1 text-gray-900 dark:text-gray-100">{member.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.position}</p>
                          
                          {/* Рейтинг и опыт */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-semibold">{member.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                              <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{member.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Статистика */}
                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">{member.projectsCount}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Проектов</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                            {member.location}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Локация</div>
                        </div>
                      </div>

                      {/* Экспертиза */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                          <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Специализация:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {member.specialties.slice(0, 2).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2 md:px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Разделитель */}
                    <div className="px-4 md:px-6">
                      <div className="border-t border-gray-200 dark:border-gray-800"></div>
                    </div>

                    {/* Нижняя часть с действиями */}
                    <div className="p-4 md:p-6 pt-3 md:pt-4 mt-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {member.expertise.slice(0, 2).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                          icon={<ChevronRight className="w-3 h-3 md:w-4 md:h-4" />}
                          className="text-sm group-hover:text-blue-600"
                        >
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="max-w-4xl mx-auto mt-12 md:mt-20">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 md:mb-6">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Готовы к сотрудничеству?</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">
              Нужна помощь с оборудованием?
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto">
              Наши специалисты подберут оптимальное оборудование для вашего мероприятия
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={<Phone className="w-4 h-4 md:w-5 md:h-5" />}
                className="text-sm md:text-base"
              >
                <a href="tel:+74951234567">Позвонить</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Mail className="w-4 h-4 md:w-5 md:h-5" />}
                className="text-sm md:text-base"
              >
                <a href="/contact">Написать</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-2 md:p-4 z-50 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setSelectedMember(null)}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto">
            <div className="p-4 md:p-6">
              {/* Шапка */}
              <div className="flex items-start justify-between mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const DeptIcon = getDepartmentIcon(selectedMember.department);
                      return <DeptIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl mb-1 text-gray-900 dark:text-gray-100">{selectedMember.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedMember.position}</p>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{selectedMember.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedMember.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Контент */}
              <div className="space-y-6 md:space-y-8">
                {/* Основная информация */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Briefcase className="w-4 h-4" />
                        Опыт работы
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedMember.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Award className="w-4 h-4" />
                        Специализация
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.specialties.map((item, idx) => (
                          <span key={idx} className="px-3 py-1.5 text-sm rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Target className="w-4 h-4" />
                        Статистика
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{selectedMember.projectsCount}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Проектов</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{selectedMember.rating}/5</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Рейтинг</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Биография */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">О специалисте</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Экспертиза */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Экспертиза</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {selectedMember.expertise.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Контакты и кнопка */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Контакты</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a 
                        href={`tel:${selectedMember.phone}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Phone className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{selectedMember.phone}</span>
                      </a>
                      <a 
                        href={`mailto:${selectedMember.email}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Mail className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{selectedMember.email}</span>
                      </a>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-3 md:py-4"
                    onClick={() => window.location.href = `/contact?specialist=${selectedMember.id}`}
                    icon={<MessageSquare className="w-4 h-4 md:w-5 md:h-5" />}
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