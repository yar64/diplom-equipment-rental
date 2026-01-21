import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { equipmentCategories, contactInfo } from '../shared/constants';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-foreground">EventRent</span>
            </div>
            <p className="text-muted-foreground mb-8">
              Профессиональная аренда оборудования для мероприятий с 2018 года. Создаем незабываемые впечатления.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6 text-lg">Каталог</h4>
            <ul className="space-y-4">
              {equipmentCategories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6 text-lg">Компания</h4>
            <ul className="space-y-4">
              {['О нас', 'Доставка и оплата', 'Контакты', 'Вакансии'].map((item, idx) => (
                <li key={idx}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6 text-lg">Контакты</h4>
            <div className="space-y-5">
              {contactInfo.map((contact, idx) => (
                <p key={idx} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-lg mt-0.5">{contact.icon}</span>
                  <span>{contact.text}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>© 2024 EventRent. Все права защищены. Создаем незабываемые мероприятия.</p>
        </div>
      </div>
    </footer>
  );
}