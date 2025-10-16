import { z } from 'zod';

export const addProductSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  price: z.coerce.number()
    .min(0.01, 'Price must be greater than 0')
    .max(100000, 'Price must be less than $100,000'),
  
  brand: z.string()
    .min(1, 'Brand is required')
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand must be less than 50 characters'),
  
  category: z.string()
    .min(1, 'Category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  
  stock: z.coerce.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock must be less than 10,000'),
  
  thumbnail: z.string()
    .optional()
    .refine((val) => !val || val.startsWith('data:image/') || val.startsWith('http'), 
      'Thumbnail must be a valid image URL or data URI'),
  
  images: z.array(z.string())
    .optional()
    .refine((val) => !val || val.every(img => img.startsWith('data:image/') || img.startsWith('http')), 
      'All images must be valid image URLs or data URIs'),
});

export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .min(2, 'Username must be at least 2 characters'),
  
  password: z.string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters'),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
