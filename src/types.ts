export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'WOMEN' | 'MEN' | 'UNISEX';
  price: number;
  originalPrice?: number;
  badge?: 'NEW' | '-30%' | '-20%' | 'HOT';
  rating: number;
  image: string;
  type: 'bracelet' | 'ring' | 'earrings' | 'pendant';
  section?: 'best_seller' | 'new_arrival' | 'both';
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  author: string;
  commentsCount: number;
  date: string;
  excerpt: string;
}

export interface PopularCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
