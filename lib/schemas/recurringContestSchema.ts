import { z } from 'zod';

export const recurringDetailsSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(160),
    category: z.string().trim().max(100).optional(),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(5000, 'Description is too long'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isMoneyContest: z.boolean().default(false),
    minPrize: z.coerce.number().int().min(0).default(0),
    maxPrize: z.coerce.number().int().min(0).default(0),
    currency: z.string().trim().toUpperCase().max(3).optional(),
    entryFeeCoins: z.coerce.number().int().min(0).max(100000000).default(0),
  })
  .superRefine((data, ctx) => {
    if (data.startDate >= data.endDate) {
      ctx.addIssue({ path: ['endDate'], code: 'custom', message: 'End date must be after start date' });
    }
    if (data.isMoneyContest) {
      if (!data.currency || !/^[A-Z]{3}$/.test(data.currency)) {
        ctx.addIssue({
          path: ['currency'],
          code: 'custom',
          message: 'A valid 3-letter currency code is required',
        });
      }
      if (data.minPrize > data.maxPrize) {
        ctx.addIssue({
          path: ['minPrize'],
          code: 'custom',
          message: 'Min prize cannot exceed max prize',
        });
      }
    }
  });

export type RecurringDetailsValues = z.infer<typeof recurringDetailsSchema>;

export const recurringIntervalSchema = z
  .object({
    recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
    timezone: z.string().trim().min(1).max(100).default('UTC'),
    endsAt: z.coerce.date().optional(),
    maxOccurrences: z.coerce.number().int().positive().max(10000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endsAt && data.endsAt <= new Date()) {
      ctx.addIssue({
        path: ['endsAt'],
        code: 'custom',
        message: 'Recurrence end must be in the future',
      });
    }
  });

export type RecurringIntervalValues = z.infer<typeof recurringIntervalSchema>;
