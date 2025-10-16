import { Product, ProductsResponse, AddProductData, ApiParams } from '@/types/product';
import { getLocalProducts, saveLocalProduct } from './localStorage';

const API_BASE = 'https://dummyjson.com';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.statusText}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProducts(params: ApiParams): Promise<ProductsResponse> {
  // Get local products and apply filters first to determine pagination adjustments
  const localProducts = getLocalProducts();
  let filteredLocalProducts = localProducts;

  // Apply search filter to local products
  if (params.search) {
    filteredLocalProducts = filteredLocalProducts.filter(product =>
      product.title.toLowerCase().includes(params.search!.toLowerCase()) ||
      product.description.toLowerCase().includes(params.search!.toLowerCase()) ||
      product.brand.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  // Apply category filter to local products
  if (params.category || (params.categories && params.categories.length > 0)) {
    const selectedCategories = params.categories && params.categories.length > 0 
      ? params.categories 
      : params.category ? [params.category] : [];
    
    filteredLocalProducts = filteredLocalProducts.filter(product =>
      selectedCategories.some(cat => 
        product.category.toLowerCase() === cat.toLowerCase()
      )
    );
  }

  // Apply brand filter to local products
  if (params.brand || (params.brands && params.brands.length > 0)) {
    const selectedBrands = params.brands && params.brands.length > 0 
      ? params.brands 
      : params.brand ? [params.brand] : [];
    
    filteredLocalProducts = filteredLocalProducts.filter(product =>
      selectedBrands.some(brand => 
        product.brand.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // Apply price filters to local products
  if (params.priceMin !== undefined) {
    filteredLocalProducts = filteredLocalProducts.filter(product => product.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filteredLocalProducts = filteredLocalProducts.filter(product => product.price <= params.priceMax!);
  }

  // Apply status filter to local products
  if (params.status) {
    filteredLocalProducts = filteredLocalProducts.filter(product => {
      switch (params.status) {
        case 'out-of-stock':
          return product.stock === 0;
        case 'low-stock':
          return product.stock > 0 && product.stock < 10;
        case 'in-stock':
          return product.stock >= 10;
        default:
          return true;
      }
    });
  }

  const searchParams = new URLSearchParams();
  
  // Adjust pagination based on local products (only affects page 1)
  const localProductsCount = filteredLocalProducts.length;
  const isFirstPage = params.page === 1;
  
  let apiSkip: number;
  let apiLimit: number;
  
  if (isFirstPage && localProductsCount > 0) {
    // Page 1: Reduce API limit to make room for local products
    apiSkip = 0;
    apiLimit = Math.max(0, params.limit - localProductsCount);
  } else {
    // Page 2+: Adjust skip to account for local products shown on page 1
    const localProductsOnFirstPage = isFirstPage ? 0 : localProductsCount;
    apiSkip = ((params.page - 1) * params.limit) - localProductsOnFirstPage;
    apiLimit = params.limit;
  }
  
  searchParams.append('skip', apiSkip.toString());
  searchParams.append('limit', apiLimit.toString());

  // Add sorting (only supported fields)
  if (params.sort) {
    const [field, order] = params.sort.split('-');
    // Map our field names to DummyJSON supported fields
    const sortMapping: Record<string, string> = {
      'createdAt': 'id', // DummyJSON doesn't have createdAt, use id as proxy
      'price': 'price',
      'rating': 'rating',
      'title': 'title'
    };
    
    const mappedField = sortMapping[field] || 'id';
    searchParams.append('sortBy', mappedField);
    searchParams.append('order', order);
  }

  // Determine which endpoint to use based on filters
  let url = '/products';

  // If single category is specified, use category endpoint (for efficiency)
  // If multiple categories are selected, use general endpoint and filter client-side
  if (params.category && (!params.categories || params.categories.length === 0)) {
    url = `/products/category/${encodeURIComponent(params.category)}`;
    // Add pagination to category endpoint
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  } 
  // If search is specified, use search endpoint
  else if (params.search) {
    searchParams.append('q', params.search);
    url = `/products/search?${searchParams.toString()}`;
  }
  // Otherwise use regular products endpoint
  else {
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Fetch from DummyJSON
  const response = await fetchApi<ProductsResponse>(url);
  
  // Apply client-side filters for unsupported parameters
  let filteredProducts = response.products;

  // Filter by category (client-side) - needed when multiple categories or when using general endpoint
  if (params.categories && params.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      params.categories!.some(cat => 
        product.category.toLowerCase() === cat.toLowerCase()
      )
    );
  }

  // Filter by brand (client-side)
  if (params.brand || (params.brands && params.brands.length > 0)) {
    const selectedBrands = params.brands && params.brands.length > 0 
      ? params.brands 
      : params.brand ? [params.brand] : [];
    
    filteredProducts = filteredProducts.filter(product =>
      selectedBrands.some(brand => 
        product.brand.toLowerCase().includes(brand.toLowerCase())
      )
    );
  }

  // Filter by price range (client-side)
  if (params.priceMin !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= params.priceMax!);
  }

  // Filter by stock status (client-side)
  if (params.status) {
    filteredProducts = filteredProducts.filter(product => {
      switch (params.status) {
        case 'out-of-stock':
          return product.stock === 0;
        case 'low-stock':
          return product.stock > 0 && product.stock < 10;
        case 'in-stock':
          return product.stock >= 10;
        default:
          return true;
      }
    });
  }

  // Add mock createdAt field for products that don't have it
  const enrichedProducts = filteredProducts.map(product => ({
    ...product,
    createdAt: product.createdAt || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));

  // Combine products based on page
  let finalProducts: Product[];
  let totalProducts: number;
  let filteredTotal: number;
  
  if (isFirstPage && localProductsCount > 0) {
    // Page 1: Include local products + API products
    const combinedProducts = [...filteredLocalProducts, ...enrichedProducts];
    
    // Apply client-side sorting if needed
    if (params.brand || (params.brands && params.brands.length > 0) || (params.categories && params.categories.length > 0) || params.priceMin || params.priceMax || params.status || params.sort) {
      if (params.sort) {
        const [field, order] = params.sort.split('-');
        combinedProducts.sort((a, b) => {
          let aVal = a[field as keyof Product];
          let bVal = b[field as keyof Product];
          
          if (typeof aVal === 'string') aVal = aVal.toLowerCase();
          if (typeof bVal === 'string') bVal = bVal.toLowerCase();
          
          if (aVal < bVal) return order === 'asc' ? -1 : 1;
          if (aVal > bVal) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }
    
    // Take only the requested page size
    finalProducts = combinedProducts.slice(0, params.limit);
    totalProducts = response.total + localProductsCount;
    filteredTotal = combinedProducts.length;
  } else {
    // Page 2+: Only API products
    finalProducts = enrichedProducts;
    totalProducts = response.total + localProductsCount;
    
    // For filtered total, we need to account for local products that would be on page 1
    if (params.brand || (params.brands && params.brands.length > 0) || params.category || (params.categories && params.categories.length > 0) || params.priceMin || params.priceMax || params.status || params.search) {
      // When filters are active, estimate total filtered count
      filteredTotal = response.total + localProductsCount; // This is approximate
    } else {
      filteredTotal = totalProducts;
    }
  }

  // Calculate proper skip value for display
  const displaySkip = isFirstPage ? 0 : ((params.page - 1) * params.limit) - localProductsCount;

  return {
    products: finalProducts,
    total: totalProducts,
    skip: Math.max(0, displaySkip),
    limit: params.limit,
    filteredTotal: filteredTotal,
  };
}

export async function getProductById(id: number): Promise<Product> {
  // First check if it's a local product
  const localProducts = getLocalProducts();
  const localProduct = localProducts.find(product => product.id === id);
  
  if (localProduct) {
    return localProduct;
  }
  
  // If not found locally, fetch from API
  return fetchApi<Product>(`/products/${id}`);
}

export async function getCategories(): Promise<string[]> {
  const response = await fetchApi<Array<{slug: string, name: string}>>('/products/categories');
  return response.map(category => category.slug);
}

export async function getBrands(): Promise<string[]> {
  // DummyJSON doesn't have a brands endpoint, so we'll fetch ALL products and extract unique brands
  // Total products in API is 194, so we fetch all of them to get complete brand coverage
  const response = await fetchApi<ProductsResponse>('/products?limit=194');
  const apiBrands = response.products.map(product => product.brand);
  
  // Get brands from local products
  const localProducts = getLocalProducts();
  const localBrands = localProducts.map(product => product.brand);
  
  // Combine and deduplicate
  const allBrands = [...new Set([...apiBrands, ...localBrands])];
  return allBrands.sort();
}

// Mock function for adding a product (since DummyJSON doesn't support POST)
export async function addProduct(data: AddProductData): Promise<Product> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response - in a real app, this would be a POST request
  const newProduct: Product = {
    id: Date.now(), // Mock ID
    title: data.title,
    description: data.description,
    price: data.price,
    discountPercentage: 0,
    rating: 0,
    stock: data.stock,
    brand: data.brand,
    category: data.category,
    thumbnail: data.thumbnail || '/placeholder-product.jpg',
    images: data.images && data.images.length > 0 ? data.images : [data.thumbnail || '/placeholder-product.jpg'],
    createdAt: new Date().toISOString(),
  };

  // Save to localStorage for persistence
  saveLocalProduct(newProduct);

  return newProduct;
}
