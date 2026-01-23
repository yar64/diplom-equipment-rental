// app/components/home/TestimonialsSection.tsx
import TestimonialCard from '../ui/TestimonialCard';

const testimonials = [
  {
    name: 'Александр Петров',
    role: 'Организатор фестивалей',
    text: 'EventRent стал нашим стратегическим партнером. Благодаря их оборудованию и поддержке мы провели самые масштабные мероприятия сезона.',
    rating: 5,
    initials: 'АП'
  },
  {
    name: 'Марина Иванова',
    role: 'Event-директор агентства',
    text: 'Работаем 2 года - ни одной проблемы. Их инженеры всегда на связи, даже в ночь перед мероприятием. Это бесценно!',
    rating: 5,
    initials: 'МИ'
  },
  {
    name: 'Дмитрий Сидоров',
    role: 'Владелец сети клубов',
    text: 'Лучшее соотношение цена/качество на рынке. Техника всегда в идеальном состоянии, как новая.',
    rating: 4,
    initials: 'ДС'
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-secondary w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4">
          <div className="inline-flex items-center gap-2 bg-accent px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4 border border-border">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Мнения клиентов</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Говорят наши <span className="text-primary">клиенты</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Реальные отзывы от организаторов крупнейших мероприятий
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}