'use client';

import { useState } from 'react';
import { 
  Music, Briefcase, Heart, GraduationCap, 
  PartyPopper, Trophy, Users, Megaphone, Sparkles 
} from 'lucide-react';
import Card, { CardContent } from './Card';

const EVENT_TYPES = [
  {
    id: 'concert',
    label: 'Концерт',
    icon: Music,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
    description: 'Музыкальное шоу, выступление артистов'
  },
  {
    id: 'corporate',
    label: 'Корпоратив',
    icon: Briefcase,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Корпоративное мероприятие, тимбилдинг'
  },
  {
    id: 'wedding',
    label: 'Свадьба',
    icon: Heart,
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-800',
    description: 'Свадебная церемония, банкет'
  },
  {
    id: 'conference',
    label: 'Конференция',
    icon: GraduationCap,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    description: 'Деловая встреча, конференция, семинар'
  },
  {
    id: 'festival',
    label: 'Фестиваль',
    icon: PartyPopper,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    description: 'Праздник, фестиваль, массовое мероприятие'
  },
  {
    id: 'sports',
    label: 'Спортивное',
    icon: Trophy,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    description: 'Спортивное соревнование, марафон'
  },
  {
    id: 'team-building',
    label: 'Тимбилдинг',
    icon: Users,
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    description: 'Командные игры, активный отдых'
  },
  {
    id: 'exhibition',
    label: 'Выставка',
    icon: Megaphone,
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    description: 'Выставка, экспозиция, показ'
  },
];

interface EventTypeSelectorProps {
  value?: string;
  onChange?: (eventType: string) => void;
  compact?: boolean;
}

export default function EventTypeSelector({ 
  value = 'corporate',
  onChange,
  compact = false 
}: EventTypeSelectorProps) {
  const [selected, setSelected] = useState(value);

  const handleSelect = (eventType: string) => {
    setSelected(eventType);
    onChange?.(eventType);
  };

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Тип мероприятия</h3>
            <p className="text-sm text-muted-foreground">
              Выберите тип для персонализированных рекомендаций
            </p>
          </div>
        </div>

        <div className={`
          grid gap-2 sm:gap-3
          ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8'}
        `}>
          {EVENT_TYPES.map((event) => (
            <button
              key={event.id}
              onClick={() => handleSelect(event.id)}
              className={`
                flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2
                transition-all duration-300 hover:scale-105 hover:shadow-sm
                ${selected === event.id 
                  ? `${event.color} ${event.borderColor} border-2 scale-105 shadow-sm` 
                  : 'border-muted hover:border-muted-foreground/30'
                }
              `}
            >
              <event.icon className={`
                w-5 h-5 sm:w-6 sm:h-6 mb-2
                ${selected === event.id ? 'scale-110' : ''}
              `} />
              <span className={`
                font-medium text-sm sm:text-base text-center
                ${selected === event.id ? 'font-semibold' : ''}
              `}>
                {event.label}
              </span>
              {!compact && (
                <span className="text-xs text-muted-foreground mt-1 text-center hidden sm:block">
                  {event.description}
                </span>
              )}
            </button>
          ))}
        </div>

        {selected && !compact && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Выбрано: </span>
                <span className="font-semibold">
                  {EVENT_TYPES.find(e => e.id === selected)?.label}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ✓ Персонализированные рекомендации активированы
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}