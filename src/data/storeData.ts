import { Product, BlogPost, PopularCategory } from '../types';

export const BEST_SELLER_PRODUCTS: Product[] = [
  {
    id: 'bs-1',
    name: 'BLUE RING IN GED PALLADIUM FINISH METAL',
    category: 'WOMEN',
    price: 300.00,
    originalPrice: 400.00,
    badge: 'NEW',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isBestSeller: true
  },
  {
    id: 'bs-2',
    name: 'GREY RING IN GED PALLADIUM FINISH METAL',
    category: 'WOMEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isBestSeller: true
  },
  {
    id: 'bs-3',
    name: 'BROWN RING IN GED PALLADIUM FINISH METAL',
    category: 'MEN',
    price: 700.00,
    originalPrice: 900.00,
    badge: '-30%',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isBestSeller: true
  },
  {
    id: 'bs-4',
    name: 'BEG RING IN GED PALLADIUM FINISH METAL',
    category: 'WOMEN',
    price: 600.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isBestSeller: true
  }
];

export const NEW_ARRIVALS_PRODUCTS: Product[] = [
  {
    id: 'na-1',
    name: 'D&L SO REAL POP SUNGLASSES BLUE',
    category: 'MEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1611591475281-912f7166184a?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isNewArrival: true
  },
  {
    id: 'na-2',
    name: 'D&L SO REAL POP SUNGLASSES GREEN',
    category: 'WOMEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isNewArrival: true
  },
  {
    id: 'na-3',
    name: 'D&L SO REAL POP SUNGLASSES YELLOW',
    category: 'WOMEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    type: 'ring',
    isNewArrival: true
  },
  {
    id: 'na-4',
    name: 'D&L SO REAL POP SUNGLASSES YELLOW',
    category: 'WOMEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    type: 'earrings',
    isNewArrival: true
  },
  {
    id: 'na-5',
    name: 'D&L SO REAL POP SUNGLASSES YELLOW',
    category: 'WOMEN',
    price: 300.00,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80',
    type: 'earrings',
    isNewArrival: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'SLIDE IMAGE POST FORMAT',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    author: 'Admin',
    commentsCount: 5,
    date: 'Dec 09 2017',
    excerpt: 'Phasellus ut condimentum diam, eget tempus lorem. Morbi bibendum est quis arcu posuere condimentum. Nullam justo eros pellentesque'
  },
  {
    id: 'blog-2',
    title: 'SLIDE IMAGE POST FORMAT',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    author: 'Admin',
    commentsCount: 5,
    date: 'Dec 09 2017',
    excerpt: 'Phasellus ut condimentum diam, eget tempus lorem. Morbi bibendum est quis arcu posuere condimentum. Nullam justo eros pellentesque'
  },
  {
    id: 'blog-3',
    title: 'SLIDE IMAGE POST FORMAT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    author: 'Admin',
    commentsCount: 5,
    date: 'Dec 09 2017',
    excerpt: 'Phasellus ut condimentum diam, eget tempus lorem. Morbi bibendum est quis arcu posuere condimentum. Nullam justo eros pellentesque'
  }
];

export const POPULAR_CATEGORIES: PopularCategory[] = [
  {
    id: 'pop-1',
    title: 'BRACELETS FOR MEN',
    subtitle: '2 Row Ring with Diamonds',
    image: 'https://images.unsplash.com/photo-1611591475281-912f7166184a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pop-2',
    title: 'RINGS FOR WOMEN',
    subtitle: 'Ring with Diamonds and Sapphires',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pop-3',
    title: 'EARRINGS',
    subtitle: 'Drop Pendant',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
  }
];
