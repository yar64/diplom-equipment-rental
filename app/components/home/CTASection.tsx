import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Готовы создать <span className="text-primary">незабываемое</span> мероприятие?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Подберем идеальное оборудование под ваш бюджет. Консультация инженера бесплатно!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="primary" size="lg">
              Получить консультацию
            </Button>
            <Button variant="outline" size="lg">
              +7 (999) 123-45-67
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}