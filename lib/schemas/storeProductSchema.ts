import { z } from 'zod';

export const storeProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  productType: z.enum(['key', 'boost', 'swap'], {
    errorMap: () => ({ message: 'Select a valid product type' }),
  }),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().nonnegative('Quantity must be 0 or greater'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  image: z.string().url('Image must be a valid URL').optional(),
  isActive: z.boolean().default(true),
});

export type StoreProductFormData = z.infer<typeof storeProductSchema>;
