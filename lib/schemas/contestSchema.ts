import z from 'zod';

export const contestSchema = z.object({
  // Step 1: Details
  title: z.string().min(5, 'Title is too short'),
  description: z.string().min(20, 'Description must be detailed'), // HTML string from Tiptap
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' }),

  // Step 2: Rules (Array)
  rules: z
    .array(
      z.object({
        title: z.string().min(3, 'Rule title required'),
        icon: z.string(),
        description: z.string().min(10, 'Rule description required'), // HTML string
      }),
    )
    .min(1, 'Add at least one rule'),

  // Step 3: Prizes (Array)
  prizes: z
    .array(
      z.object({
        type: z.enum(['photo_winner', 'photographer_winner', 'yc_top_winner']),
        title: z.string().min(2, 'Prize title required'),
        amount: z.string().min(1, 'Amount/Value is required'), // e.g., "$500"
        keyBoost: z.coerce.number().min(0).default(0), // Key Boost amount (number)
        swap: z.coerce.number().min(0).default(0), // Swap amount (number)
        description: z.string().optional(),
      }),
    )
    .min(1, 'Add at least one prize'),
});

export type ContestValues = z.infer<typeof contestSchema>;
