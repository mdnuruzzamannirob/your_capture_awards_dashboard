import { z } from 'zod';

export const supportSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  email: z.string().email('Enter a valid email address.'),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Please select a priority level.',
  }),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters long.')
    .max(1000, 'Message must not exceed 1000 characters.'),
});

export type SupportFormData = z.infer<typeof supportSchema>;
