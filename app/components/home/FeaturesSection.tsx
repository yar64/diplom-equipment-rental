import { features } from '../shared/constants';
import FeatureCard from '../ui/FeatureCard';

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4 border border-border">
            <span className="text-sm font-medium text-muted-foreground">Наши преимущества</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Почему EventRent — <span className="text-primary">выбор профессионалов</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Мы не просто сдаем оборудование — мы обеспечиваем успех ваших мероприятий
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}