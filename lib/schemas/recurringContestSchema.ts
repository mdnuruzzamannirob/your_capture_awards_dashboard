import { z } from 'zod';
import { MAX_CONTEST_CATEGORIES } from '@/lib/contestCategories';
import { WEB_IMAGE_MIME_TYPES } from '@/lib/constants/uploads';
import {
  DEFAULT_CURRENCY,
  formatCurrencyAmount,
  MIN_PAID_ENTRY_FEE,
  SUPPORTED_CURRENCIES,
} from '@/lib/currency';

const MAX_BANNER_SIZE = 24 * 1024 * 1024;
const ALLOWED_BANNER_TYPES: readonly string[] = WEB_IMAGE_MIME_TYPES;

export const recurringDetailsSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(160),
    categories: z
      .array(z.string().trim().min(1).max(100, 'A category must not exceed 100 characters'))
      .max(MAX_CONTEST_CATEGORIES, `Add at most ${MAX_CONTEST_CATEGORIES} categories`)
      .default([]),
    // A File when the admin uploads a new banner; the current banner URL otherwise.
    banner: z
      .union([z.custom<File>((file) => file instanceof File), z.string()])
      .optional()
      .refine(
        (value) => !(value instanceof File) || ALLOWED_BANNER_TYPES.includes(value.type),
        'Only JPG, PNG, WEBP images are allowed',
      )
      .refine(
        (value) => !(value instanceof File) || value.size <= MAX_BANNER_SIZE,
        'Image must be under 24MB',
      ),
    // Set when the banner was picked from an existing user-submitted photo.
    bannerUserPhotoId: z.string().optional(),
    // Also update the already-scheduled (not yet started) occurrence.
    applyToUpcoming: z.boolean().default(true),
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
    // Generated contests charge their entry fee in this currency.
    currency: z.enum(SUPPORTED_CURRENCIES).default(DEFAULT_CURRENCY),
    entryFeeAmount: z.coerce
      .number()
      .min(0)
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
        'Entry fee can have at most 2 decimal places',
      )
      .default(0),
    entryFeeCoins: z.coerce.number().int().min(0).max(100000000).default(0),
  })
  .superRefine((data, ctx) => {
    if (data.startDate >= data.endDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'End date must be after start date',
      });
    }
    const minFee = MIN_PAID_ENTRY_FEE[data.currency];
    if (data.entryFeeAmount !== 0 && data.entryFeeAmount < minFee) {
      ctx.addIssue({
        path: ['entryFeeAmount'],
        code: 'custom',
        message: `Entry fee must be 0 (free) or at least ${formatCurrencyAmount(minFee, data.currency)}`,
      });
    }
    if (data.isMoneyContest) {
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
