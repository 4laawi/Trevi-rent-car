export interface SupabaseCar {
  id: number;
  created_at?: string;
  name: string;        // model
  brand: string;       // make
  price_per_day: number;
  promo_price?: number | null;
  fuel_type: string;
  gearbox: string;     // transmission
  category: string;    // type
  image_url: string;
  is_available: boolean;
  description?: string | null;
  accessories?: string | null; // Comma-separated string or JSON array
}

export interface Car {
  id: string;
  make: string;
  model: string;
  type: string; // Acts as the category (Berline, SUV, etc.)
  transmission: string;
  fuel: string;
  pricePerDay: number; // in MAD
  promoPrice?: number | null; // New field for discounts
  features: string[];
  accessories?: string[]; // New field for accessories
  image: string;
  description?: string;
  isAvailable: boolean;
  
  // UI Design Props (Generated dynamically)
  accentColor: string;
  rating: number;
  reviewCount: number;
  availableCount: number;
  badge?: string;
  badgeIcon?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  language: 'en' | 'fr' | 'darija';
  date: string;
}

export interface BookingRequest {
  fullName: string;
  phone: string;
  carId: string;
  pickupDate: string;
  dropoffDate: string;
  city: string;
}