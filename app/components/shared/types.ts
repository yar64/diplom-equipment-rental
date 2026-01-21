export interface EquipmentCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
}

export interface PopularEquipment {
  id: number;
  name: string;
  price: string;
  period: string;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
}

export interface Statistic {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface ContactInfo {
  icon: string;
  text: string;
}