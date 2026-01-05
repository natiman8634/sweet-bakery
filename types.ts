
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY'
}

export interface User {
  id: string;
  username?: string;
  password?: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  bio?: string;
  joinDate?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'bread' | 'cake' | 'pastry';
  rating: number;
  stock?: number;
  vendor?: string;
  occasion?: 'birthday' | 'wedding' | 'holiday';
  breadType?: 'sourdough' | 'wheat' | 'rye' | 'white';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface BannerConfig {
  headline: string;
  subHeadline: string;
  promoCode: string;
  discount: string;
  discountLabel: string;
  image: string;
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  assignedTo: string;
  vendor?: string;
  phoneNumber: string;
  address: string;
  date: string;
  deliveryMethod: 'Delivery' | 'Pickup';
  location?: { lat: number; lng: number };
  verificationOTP?: string; // Secret generated at checkout
  riderProvidedOTP?: string; // What the rider submits
}
