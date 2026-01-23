import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background border-t border-border w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Готовы создать <span className="text-primary">незабываемое</span> мероприятие?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 px-4">
            Подберем идеальное оборудование под ваш бюджет. Консультация инженера бесплатно!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Получить консультацию
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              +7 (999) 123-45-67
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}