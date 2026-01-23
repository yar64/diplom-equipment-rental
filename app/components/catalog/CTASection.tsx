// app/catalog/components/CTASection.tsx
import { Sparkles, Users, Globe } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';

export default function CTASection() {
  return (
    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <Card className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Специальное предложение</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Нужна помощь с выбором оборудования?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Наши специалисты помогут подобрать оптимальное оборудование для вашего мероприятия. 
              Получите консультацию и индивидуальный расчет стоимости.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" className="gap-3 hover-lift" size="lg">
                <Users className="w-5 h-5" />
                Получить консультацию
              </Button>
              <Button variant="outline" className="gap-3 hover-lift" size="lg">
                <Globe className="w-5 h-5" />
                Посмотреть проекты
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}