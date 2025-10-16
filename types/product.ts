export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  filteredTotal?: number; // Count after client-side filtering
}

export interface ProductFilters {
  search?: string;
  brand?: string; // Keep for backward compatibility
  category?: string; // Keep for backward compatibility
  brands?: string[]; // New multi-select support
  categories?: string[]; // New multi-select support
  priceMin?: number;
  priceMax?: number;
  status?: 'in-stock' | 'out-of-stock' | 'low-stock';
  sort?: 'createdAt-asc' | 'createdAt-desc' | 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiParams extends ProductFilters, PaginationParams {}

export interface AddProductData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  stock: number;
  thumbnail?: string;
  images?: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}
