// app/catalog/components/HeroSection.tsx
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="mb-12 text-center animate-fade-in-up">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 text-primary mb-6 backdrop-blur-sm border border-primary/20">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Более 48 единиц оборудования</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
        Аренда профессионального
        <span className="text-primary block mt-2">оборудования для мероприятий</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        Все необходимое для ваших событий: от звука и света до энергоснабжения и стриминга
      </p>
    </section>
  );
}