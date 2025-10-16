import { Product } from '@/types/product';

const LOCAL_PRODUCTS_KEY = 'lotus_local_products';

export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading local products:', error);
    return [];
  }
}

export function saveLocalProduct(product: Product): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getLocalProducts();
    const updated = [product, ...existing];
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving local product:', error);
  }
}

export function removeLocalProduct(id: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getLocalProducts();
    const filtered = existing.filter(product => product.id !== id);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing local product:', error);
  }
}

export function clearLocalProducts(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LOCAL_PRODUCTS_KEY);
  } catch (error) {
    console.error('Error clearing local products:', error);
  }
}

export function updateLocalProduct(id: number, updates: Partial<Product>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getLocalProducts();
    const updated = existing.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating local product:', error);
  }
}