'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductById, getCategories, getBrands, addProduct } from '@/lib/api';
import { ApiParams, AddProductData, Product, ProductsResponse } from '@/types/product';

export function useProducts(params: ApiParams) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    enabled: true,
    keepPreviousData: true, // Keep previous data while loading new data
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 30 * 60 * 1000, // 30 minutes - brands don't change often
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProductData) => addProduct(data),
    onSuccess: (newProduct: Product) => {
      // Optimistically update the cache
      queryClient.setQueryData(['product', newProduct.id], newProduct);
      
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Add to products list cache if it exists
      queryClient.setQueriesData(
        { queryKey: ['products'] },
        (oldData: any) => {
          if (oldData?.products) {
            return {
              ...oldData,
              products: [newProduct, ...oldData.products],
              total: oldData.total + 1,
            };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error('Failed to add product:', error);
    },
  });
}
