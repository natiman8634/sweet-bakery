
import { Product, UserRole, PromoSlide, User } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'USR-001',
    username: 'admin', 
    password: '123', 
    role: UserRole.ADMIN, 
    name: 'Nati Admin',
    phoneNumber: '+1 (555) 000-1111',
    bio: 'Chief Operations Officer overseeing the artisan digital ecosystem.',
    joinDate: '2022-01-15'
  },
  { 
    id: 'VND-202',
    username: 'vendor', 
    password: '123', 
    role: UserRole.VENDOR, 
    name: 'Chef Pierre',
    phoneNumber: '+1 (555) 987-6543',
    bio: 'Master Patissier with 20 years of experience in French pastry and sourdough fermentation.',
    joinDate: '2023-03-10'
  },
  { 
    id: 'RID-505',
    username: 'rider', 
    password: '123', 
    role: UserRole.DELIVERY, 
    name: 'Mike Driver',
    phoneNumber: '+1 (555) 123-4567',
    bio: 'Logistics specialist committed to the fastest "Oven-to-Door" delivery times.',
    joinDate: '2024-05-22'
  },
  { 
    id: 'CST-909',
    username: 'user', 
    password: '123', 
    role: UserRole.CUSTOMER, 
    name: 'Jane Doe',
    phoneNumber: '+1 (555) 222-3333',
    bio: 'A lover of sourdough and artisanal treats.',
    joinDate: '2024-02-01'
  }
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Artisan Sourdough',
    description: 'Crispy crust with a soft, tangy interior. Fermented for 48 hours.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1585478259715-876a2560efc8?auto=format&fit=crop&w=800&q=80',
    category: 'bread',
    rating: 4.9,
    stock: 24,
    vendor: 'Chef Pierre',
    breadType: 'sourdough'
  },
  {
    id: 'b2',
    name: 'Rustic Rye Loaf',
    description: 'Deep, earthy flavors with a dense crumb. Perfect for hearty sandwiches.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'bread',
    rating: 4.6,
    stock: 15,
    vendor: 'Chef Pierre',
    breadType: 'rye'
  },
  {
    id: '2',
    name: 'Strawberry Cloud Cake',
    description: 'Light sponge cake layered with fresh strawberries and whipped cream.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.8,
    stock: 10,
    vendor: 'Chef Pierre',
    occasion: 'birthday'
  },
  {
    id: 'c2',
    name: 'Midnight Wedding Tier',
    description: 'An elegant dark chocolate multi-tier cake for modern celebrations.',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 5.0,
    stock: 3,
    vendor: 'Chef Pierre',
    occasion: 'wedding'
  },
  {
    id: 'c4',
    name: 'Royal Floral Tier',
    description: 'Bespoke three-tier wedding cake adorned with edible silk flowers.',
    price: 245.00,
    image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.9,
    stock: 2,
    vendor: 'Chef Pierre',
    occasion: 'wedding'
  },
  {
    id: 'c5',
    name: 'Golden Elegance',
    description: 'Minimalist white cake featuring hand-painted gold leaf accents.',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.8,
    stock: 4,
    vendor: 'Chef Pierre',
    occasion: 'wedding'
  },
  {
    id: 'c3',
    name: 'Holiday Spice Cake',
    description: 'Warm cinnamon and nutmeg flavors with a velvety cream cheese frosting.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1572384730691-64e0625902b4?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.7,
    stock: 8,
    vendor: 'Chef Pierre',
    occasion: 'holiday'
  },
  {
    id: 'c6',
    name: 'Winter Red Velvet',
    description: 'Classic red velvet cake decorated with festive holiday wreaths.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.9,
    stock: 15,
    vendor: 'Chef Pierre',
    occasion: 'holiday'
  },
  {
    id: 'c7',
    name: 'Artisan Yule Log',
    description: 'Traditional chocolate sponge roll with hazelnut praline filling.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.6,
    stock: 6,
    vendor: 'Chef Pierre',
    occasion: 'holiday'
  },
  {
    id: '3',
    name: 'Classic Croissants',
    description: 'Buttery, flaky layers of pure French bliss.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    category: 'pastry',
    rating: 4.7,
    stock: 50,
    vendor: 'Chef Pierre'
  },
  {
    id: '4',
    name: 'Dark Chocolate Ganache',
    description: 'Rich, velvet smooth chocolate cake with a molten center.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    category: 'cake',
    rating: 4.9,
    stock: 12,
    vendor: 'Chef Pierre',
    occasion: 'birthday'
  },
  {
    id: 'b3',
    name: 'Heritage Whole Wheat',
    description: 'Nutritious whole wheat made with stone-ground heritage grains.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    category: 'bread',
    rating: 4.8,
    stock: 30,
    vendor: 'Chef Pierre',
    breadType: 'wheat'
  }
];

export const DEFAULT_PROMO_SLIDES: PromoSlide[] = [
  {
    id: '1',
    title: 'Morning Magic: 20% Off Breads',
    subtitle: 'Start your day with the smell of fresh artisan sourdough.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Order Bread'
  },
  {
    id: '2',
    title: 'Sweet Celebrations',
    subtitle: 'Bespoke cakes for your most precious moments.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c826a0?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Custom Cake'
  }
];
