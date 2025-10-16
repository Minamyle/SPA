import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts, useProduct } from '@/hooks/useProducts';

// Mock the API module completely
jest.mock('@/lib/api', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  getCategories: jest.fn(),
  getBrands: jest.fn(),
  addProduct: jest.fn(),
}));

const { getProducts, getProductById } = require('@/lib/api');

const mockProductsResponse = {
  products: [
    {
      id: 1,
      title: 'Test Product 1',
      description: 'Description 1',
      price: 99.99,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      brand: 'Brand A',
      category: 'electronics',
      thumbnail: '/test1.jpg',
      images: ['/test1.jpg'],
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Product 2',
      description: 'Description 2',
      price: 49.99,
      discountPercentage: 5,
      rating: 4.0,
      stock: 25,
      brand: 'Brand B',
      category: 'clothing',
      thumbnail: '/test2.jpg',
      images: ['/test2.jpg'],
      createdAt: '2023-01-02T00:00:00Z',
    },
  ],
  total: 2,
  skip: 0,
  limit: 10,
};

const mockProduct = mockProductsResponse.products[0];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches products successfully', async () => {
    getProducts.mockResolvedValue(mockProductsResponse);

    const { result } = renderHook(
      () => useProducts({ page: 1, limit: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProductsResponse);
    expect(getProducts).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch products';
    getProducts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(
      () => useProducts({ page: 1, limit: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('passes correct parameters to API', async () => {
    getProducts.mockResolvedValue(mockProductsResponse);

    const params = {
      page: 2,
      limit: 20,
      search: 'test',
      brand: 'Brand A',
      category: 'electronics',
      sort: 'price-asc' as const,
    };

    renderHook(() => useProducts(params), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalledWith(params);
    });
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches single product successfully', async () => {
    getProductById.mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useProduct(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProduct);
    expect(getProductById).toHaveBeenCalledWith(1);
  });

  it('does not fetch when id is invalid', () => {
    const { result } = renderHook(() => useProduct(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(getProductById).not.toHaveBeenCalled();
  });

  it('handles product not found', async () => {
    getProductById.mockRejectedValue(new Error('Product not found'));

    const { result } = renderHook(() => useProduct(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});