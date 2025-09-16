
export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
  icon?: string;
  level?: number;
  path?: string[];
  count?: number;
}

export interface ProductFilters {
  priceRange: [number, number];
  inStock: boolean;
  sortBy: string;
  categories: string[];
  cuisines: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  categories?: Category[];
  stock_quantity: number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  backup_url?: string;
  details?: any;
  nutrition?: any;
  image_url_1?: string | null;
  image_url_2?: string | null;
  image_url_3?: string | null;
  image_url_4?: string | null;
  image_url?: string;
  promotion?: string;
  availability?: string;
  brands?: string[];
  video_id?: string;
  discount?: number;
  originalPrice?: number;
  new?: boolean;
  category?: string;
  cuisine_type?: string;
  tags?: string[];
  stock?: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  popular?: boolean;
}

export interface Breadcrumb {
  name: string;
  href: string;
}

export interface CulturalArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  image_url?: string;
  image?: string;
  region?: string;
  tags?: string[];
  summary?: string;
  reading_time?: number;
  created_at?: string;
  updated_at?: string;
  publishDate?: string;
}

export interface CookingVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  video_type?: 'Recipe' | 'Food Culture' | 'Category' | 'Item';
  related_id?: string;
  created_at?: string;
  updated_at?: string;
  chef?: string;
  duration?: number;
  views?: number;
  cuisine_type?: string;
  relatedProducts?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions?: string[];
  steps?: string[];
  prep_time?: number;
  cook_time?: number;
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  image_url?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  rating?: number;
  cuisine_type?: string;
}
