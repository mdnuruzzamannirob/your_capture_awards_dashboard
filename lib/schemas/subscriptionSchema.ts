import { z } from 'zod';

export const subscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(2, 'Plan name must be at least 2 characters')
    .max(100, 'Plan name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z.number().min(0, 'Price must be 0 or greater').max(10000, 'Price is too high'),
  billingCycle: z
    .enum(['monthly', 'yearly'])
    .refine((value) => value === 'monthly' || value === 'yearly', {
      message: 'Select a valid billing cycle',
    }),
  features: z
    .array(z.string().min(1, 'Feature cannot be empty').max(200, 'Feature text too long'))
    .min(1, 'Add at least one feature')
    .max(10, 'Maximum 10 features allowed'),

  isActive: z.boolean(),
});

export type SubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;
