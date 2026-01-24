import { z } from 'zod';

/* CONSTANTS */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/* STEP 1 — DETAILS */
export const contestDetailsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),

    description: z
      .string()
      .trim()
      .min(20, 'Description must be at least 20 characters')
      .max(2000, 'Description is too long'),

    banner: z
      .custom<File>((file) => file instanceof File, {
        message: 'Banner image is required',
      })
      .refine(
        (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
        'Only JPG, PNG, WEBP images are allowed',
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Image must be under 5MB'),

    maxUploads: z.coerce
      .number()
      .int()
      .min(1, 'At least 1 upload required')
      .max(4, 'Maximum 4 uploads allowed')
      .default(4),

    recurring: z.coerce.boolean().default(false),

    recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate >= data.endDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'End date must be after start date',
      });
    }

    if (data.recurring && !data.recurringType) {
      ctx.addIssue({
        path: ['recurringType'],
        code: 'custom',
        message: 'Recurring type is required',
      });
    }
  });

/* STEP 2 — PRIZES (Contest Meta + Money Logic) */
export const contestPrizesSchema = z
  .object({
    type: z.enum(['OPEN', 'PREMIUM', 'PRO']),

    isMoneyContest: z.coerce.boolean().default(false),

    minPrize: z.coerce.number().min(0).default(0),
    maxPrize: z.coerce.number().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (data.isMoneyContest && data.maxPrize <= 0) {
      ctx.addIssue({
        path: ['maxPrize'],
        code: 'custom',
        message: 'Money contest must have prize amount',
      });
    }

    if (data.minPrize > data.maxPrize) {
      ctx.addIssue({
        path: ['minPrize'],
        code: 'custom',
        message: 'Min prize cannot exceed max prize',
      });
    }
  });

/* STEP 3 — RULES */
export const contestRulesSchema = z
  .array(
    z.object({
      name: z.string().trim().min(3, 'Rule name is required'),
      icon: z.string().min(1, 'Rule icon required'),
      description: z.string().trim().min(10, 'Rule description is required'),
    }),
  )
  .min(1, 'At least one rule is required');

/* STEP 4 — REWARDS (Leaderboard / Boost / Keys etc.) */
export const contestRewardsSchema = z
  .array(
    z.object({
      category: z.enum(['TOP_PHOTO', 'TOP_PHOTOGRAPHER']),
      icon: z.string().min(1, 'Reward icon required'),

      key: z.coerce.number().min(0).default(0),
      boost: z.coerce.number().min(0).default(0),
      swap: z.coerce.number().min(0).default(0),
    }),
  )
  .min(1, 'At least one reward is required');

/* STEP 5 — FINAL PREVIEW / SUBMIT SCHEMA */
export const contestFinalSchema = z.object({
  details: contestDetailsSchema,
  prizes: contestPrizesSchema,
  rules: contestRulesSchema,
  rewards: contestRewardsSchema,
});

/* TYPES */
export type ContestDetailsValues = z.infer<typeof contestDetailsSchema>;
export type ContestPrizesValues = z.infer<typeof contestPrizesSchema>;
export type ContestRulesValues = z.infer<typeof contestRulesSchema>;
export type ContestRewardsValues = z.infer<typeof contestRewardsSchema>;
export type ContestFinalValues = z.infer<typeof contestFinalSchema>;
