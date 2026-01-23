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

// types/equipment.ts
export interface EquipmentItem {
  id: number
  name: string
  category: string
  description: string
  price: number
  rating: number
  reviews: number
  image: string
  available: boolean
  specs: Record<string, string>
  tags: string[]
  deliveryAvailable: boolean
  setupIncluded: boolean
}

export interface CartItem extends EquipmentItem {
  quantity: number
  rentalDates: {
    start: Date
    end: Date
  }
}
// app/catalog/types.ts
export interface PopularEquipment {
  id: number;
  name: string;
  category: string;
  price: string;
  period: string;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  available: boolean;
  specs: {
    power?: string;
    connectivity?: string;
    range?: string;
    channels?: string;
    resolution?: string;
    capacity?: string;
  };
  tags: string[];
  deliveryAvailable: boolean;
  setupIncluded: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

// app/types/index.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  joinDate: string;
  avatar?: string;
}

export interface RentalHistory {
  id: number;
  equipment: string;
  type: 'audio' | 'video' | 'lighting' | 'other';
  date: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  amount: number;
  period?: string;
  details?: string;
}

export interface FavoriteEquipment {
  id: number;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  lastRented: string;
  category: string;
  price: number;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
}

export interface UserStats {
  totalRentals: number;
  totalSpent: number;
  activeRentals: number;
  rating: number;
  favoriteCategory: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}