import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const contestSchema = z
  .object({
    // STEP 1
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
        'Only JPG, PNG or WEBP images are allowed',
      )
      .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Image must be under 5MB'),

    maxUploads: z.coerce
      .number()
      .int()
      .min(1, 'At least 1 upload required')
      .max(4, 'Maximum 4 uploads allowed')
      .default(4),

    minPrize: z.coerce.number().min(0, 'Cannot be negative').default(0),
    maxPrize: z.coerce.number().min(0, 'Cannot be negative').default(0),

    isMoneyContest: z.boolean().default(false),

    recurring: z.boolean().default(false),
    recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('MONTHLY').optional(),

    mode: z.enum(['SOLO', 'TEAM']).default('SOLO'),

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),

    // STEP 2
    rules: z
      .array(
        z.object({
          name: z.string().min(3, 'Rule title is required'),
          icon: z.string().min(1, 'Rule icon required'),
          description: z.string().min(10, 'Rule description required'),
        }),
      )
      .min(1, 'At least one rule is required'),

    // STEP 3
    prizes: z
      .array(
        z.object({
          category: z.enum(['TOP_PHOTOGRAPHER', 'TOP_PHOTO']),
          icon: z.string().min(1, 'Prize icon required'),
          key: z.coerce.number().min(0).default(0),
          boost: z.coerce.number().min(0).default(0),
          swap: z.coerce.number().min(0).default(0),
        }),
      )
      .min(1, 'At least one prize required'),
  })
  .superRefine((data, ctx) => {
    if (data.startDate >= data.endDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'End date must be after start date',
      });
    }

    if (data.isMoneyContest && data.maxPrize <= 0) {
      ctx.addIssue({
        path: ['maxPrize'],
        code: 'custom',
        message: 'Money contest must have prize money',
      });
    }

    if (data.minPrize > data.maxPrize) {
      ctx.addIssue({
        path: ['minPrize'],
        code: 'custom',
        message: 'Min prize cannot exceed max prize',
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

export type ContestValues = z.infer<typeof contestSchema>;
