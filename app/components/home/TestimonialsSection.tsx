// app/components/home/TestimonialsSection.tsx
import TestimonialCard from '../ui/TestimonialCard';

// Локальная константа testimonials
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
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4 border border-border">
            <span className="text-sm font-medium text-muted-foreground">Мнения клиентов</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Говорят наши <span className="text-primary">клиенты</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Реальные отзывы от организаторов крупнейших мероприятий
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}