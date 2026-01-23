// app/components/home/FeaturesSection.tsx
import FeatureCard from '../ui/FeatureCard';

const features = [
  {
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Мгновенная доставка',
    description: 'Доставка за 3 часа по Москве. Работаем 24/7 для ваших срочных мероприятий',
    accent: 'bg-primary text-primary-foreground'
  },
  {
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Гарантия EventPro',
    description: 'Каждое оборудование проходит 17-этапную проверку перед отправкой',
    accent: 'bg-secondary text-secondary-foreground'
  },
  {
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Гибкая аренда',
    description: 'Арендуйте от 3 часов до года. Специальные тарифы для ивент-агентств',
    accent: 'bg-accent text-accent-foreground'
  },
  {
    icon: (
      <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Поддержка экспертов',
    description: 'Наши инженеры помогут с настройкой и будут на связи во время мероприятия',
    accent: 'bg-muted text-muted-foreground'
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4">
          <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4 border border-border">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Наши преимущества</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Почему Техно<span className="text-primary">Рент</span> — <span className="text-primary">выбор профессионалов</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Мы не просто сдаем оборудование — мы обеспечиваем успех ваших мероприятий
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}