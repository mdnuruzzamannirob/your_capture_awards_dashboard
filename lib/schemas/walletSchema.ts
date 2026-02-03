import { z } from 'zod';

export const walletTransactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  type: z.enum(['deposit', 'withdrawal', 'prize', 'refund', 'purchase', 'transfer'], {
    message: 'Please select a transaction type.',
  }),
  amount: z
    .number()
    .positive('Amount must be greater than 0.')
    .max(100000, 'Amount cannot exceed $100,000.'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long.')
    .max(500, 'Description must not exceed 500 characters.'),
  paymentMethod: z.string().optional(),
  referenceId: z.string().optional(),
  note: z.string().max(1000, 'Note must not exceed 1000 characters.').optional(),
});

export type WalletTransactionFormData = z.infer<typeof walletTransactionSchema>;
