import { z } from 'zod';

export const reportSchema = z.object({
  reportType: z
    .enum(['user', 'contest', 'content', 'payment', 'other'])
    .refine((value) => value !== undefined, { message: 'Please select a report type.' }),
  reportedItem: z.string().min(3, 'Reported item must be at least 3 characters long.'),
  reportedItemId: z.string().optional(),
  severity: z
    .enum(['low', 'medium', 'high', 'critical'])
    .refine((value) => value !== undefined, { message: 'Please select a severity level.' }),
  reason: z.string().min(5, 'Reason must be at least 5 characters long.'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters long.')
    .max(1000, 'Description must not exceed 1000 characters.'),
  reportedBy: z.string().optional(),
  reportedByEmail: z.string().email('Enter a valid email address.').optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
