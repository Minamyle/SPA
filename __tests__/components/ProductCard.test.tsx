import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'Test Brand',
  category: 'electronics',
  thumbnail: '/test-image.jpg',
  images: ['/test-image.jpg'],
  createdAt: '2023-01-01T00:00:00Z',
};

const mockOnClick = jest.fn();

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('10% off')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('handles click events', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('shows out of stock status when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} onClick={mockOnClick} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows low stock status when stock is low', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    render(<ProductCard product={lowStockProduct} onClick={mockOnClick} />);
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  it('handles missing discount gracefully', () => {
    const noDiscountProduct = { ...mockProduct, discountPercentage: 0 };
    render(<ProductCard product={noDiscountProduct} onClick={mockOnClick} />);
    
    expect(screen.queryByText('0% off')).not.toBeInTheDocument();
  });

  it('is accessible', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Product'));
  });
});