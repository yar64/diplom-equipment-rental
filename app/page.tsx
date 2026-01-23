// app/page.tsx
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import PopularEquipmentSection from './components/home/PopularEquipmentSection';
import FeaturesSection from './components/home/FeaturesSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import CTASection from './components/home/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main className="w-full">
        <HeroSection />
        <CategoriesSection />
        <PopularEquipmentSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
}