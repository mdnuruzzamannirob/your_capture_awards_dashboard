import { contestAwardTypes, contestRuleKeys } from '@/store/features/contest/types';
import { z } from 'zod';

const MAX_IMAGE_SIZE = 24 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const contestDetailsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(100, 'Category must not exceed 100 characters'),
    description: z
      .string()
      .trim()
      .min(20, 'Description must be at least 20 characters')
      .max(2000, 'Description is too long'),
    banner: z
      .union([z.custom<File>((file) => file instanceof File), z.string()])
      .optional()
      .refine((value) => {
        if (!value) return true;
        return value instanceof File ? ALLOWED_IMAGE_TYPES.includes(value.type) : true;
      }, 'Only JPG, PNG, WEBP images are allowed')
      .refine(
        (value) => !(value instanceof File) || value.size <= MAX_IMAGE_SIZE,
        'Image must be under 24MB',
      ),
    maxUploads: z.coerce.number().int().min(1, 'At least 1 upload is required'),
    recurring: z.boolean().default(false),
    recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    recurringTimezone: z.string().trim().min(1).max(100).default('UTC'),
    recurringEndsAt: z.coerce.date().optional(),
    recurringMaxOccurrences: z.coerce
      .number()
      .int()
      .positive('Must be at least 1')
      .max(10000)
      .optional(),
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
        message: 'Recurring frequency is required',
      });
    }
    if (data.recurring && data.recurringEndsAt && data.recurringEndsAt <= data.startDate) {
      ctx.addIssue({
        path: ['recurringEndsAt'],
        code: 'custom',
        message: 'Recurrence end must be after the first occurrence',
      });
    }
  });

export const contestPrizesSchema = z
  .object({
    isMoneyContest: z.boolean().default(false),
    minPrize: z.coerce.number().min(0).default(0),
    maxPrize: z.coerce.number().min(0).default(0),
    currency: z.string().trim().toUpperCase().max(3).optional(),
    coin_requirement: z.boolean().default(false),
    coin_required: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (data.isMoneyContest && (!data.currency || !/^[A-Z]{3}$/.test(data.currency))) {
      ctx.addIssue({
        path: ['currency'],
        code: 'custom',
        message: 'A valid 3-letter currency code is required',
      });
    }
    if (data.isMoneyContest && data.maxPrize <= 0) {
      ctx.addIssue({ path: ['maxPrize'], code: 'custom', message: 'Prize amount is required' });
    }
    if (data.isMoneyContest && data.minPrize > data.maxPrize) {
      ctx.addIssue({
        path: ['minPrize'],
        code: 'custom',
        message: 'Min prize cannot exceed max prize',
      });
    }
    if (data.coin_requirement && data.coin_required <= 0) {
      ctx.addIssue({
        path: ['coin_required'],
        code: 'custom',
        message: 'Required coins must be greater than 0',
      });
    }
  });

const requiredText = z.string().trim().min(1, 'This field is required');
const shortRuleText = requiredText.max(300, 'Text must not exceed 300 characters');

export const contestRulesSchema = z.object({
  selectedRuleKeys: z.array(z.enum(contestRuleKeys)).min(1, 'Select at least one contest rule'),
  submissionRules: z.object({
    intro: requiredText,
    disallowed: z.array(requiredText),
    removalNotice: requiredText,
    allowAiImages: z.boolean(),
    duplicatePolicy: requiredText,
  }),
  levelRequirements: z
    .array(
      z.object({
        level: z.enum(['AMATEUR', 'TALENTED', 'SUPREME', 'SUPERIOR', 'TOP_NOTCH']),
        votes: z.coerce.number().int().min(0, 'Votes cannot be negative'),
      }),
    )
    .length(5),
  submissionFormat: z.object({
    mimeTypes: z.array(z.enum(['image/jpeg', 'image/png'])).min(1, 'Select a file type'),
    minWidth: z.coerce.number().int().min(1),
    minHeight: z.coerce.number().int().min(1),
    maxSizeMB: z.coerce.number().min(1),
  }),
  eligibility: z.object({
    minAge: z.coerce.number().int().min(0).max(200),
    text: requiredText,
    requiresAcceptance: z.boolean(),
  }),
  copyright: z.object({
    text: shortRuleText,
    requiresOwnership: z.boolean(),
    requiresAcceptance: z.boolean(),
  }),
  voting: z.object({
    text: shortRuleText,
    membersOnly: z.boolean(),
    requireContestParticipant: z.boolean(),
    disallowSelfVote: z.boolean(),
    blindVoting: z.boolean(),
  }),
  participation: z.object({
    text: shortRuleText,
    requiresTermsAcceptance: z.boolean(),
    termsUrl: z.string().trim().nullable(),
  }),
});

export const contestAwardsSchema = z
  .array(
    z.object({
      type: z.enum(contestAwardTypes),
      recipient: z.enum(['Photo', 'Photographer']).optional(),
      boost: z.coerce.number().int().min(0).default(0),
      key: z.coerce.number().int().min(0).default(0),
      swap: z.coerce.number().int().min(0).default(0),
      coin: z.coerce.number().int().min(0).default(0),
    }),
  )
  .min(1, 'Add at least one award')
  .max(contestAwardTypes.length)
  .superRefine((awards, ctx) => {
    const seen = new Set<string>();
    awards.forEach((award, index) => {
      const key = `${award.type}:${award.recipient ?? ''}`;
      if (seen.has(key)) {
        ctx.addIssue({
          path: [index, 'type'],
          code: 'custom',
          message: 'Each award type can only be added once',
        });
      }
      seen.add(key);
    });

    contestAwardTypes.forEach((type) => {
      const matching = awards.filter((award) => award.type === type);
      const isTier = ['TOP_100', 'TOP_50', 'TOP_20', 'TOP_10'].includes(type);
      if (
        matching.length > 1 &&
        (!isTier ||
          matching.length !== 2 ||
          matching.some((award) => !award.recipient) ||
          new Set(matching.map((award) => award.recipient)).size !== 2)
      ) {
        const index = awards.findIndex((award) => award.type === type);
        ctx.addIssue({
          path: [index, 'type'],
          code: 'custom',
          message: 'This award type cannot be added more than once',
        });
      }
    });
  });

export const contestFinalSchema = z.object({
  details: contestDetailsSchema,
  prizes: contestPrizesSchema,
  rules: contestRulesSchema,
  awards: contestAwardsSchema,
});

export type ContestDetailsValues = z.infer<typeof contestDetailsSchema>;
export type ContestPrizesValues = z.infer<typeof contestPrizesSchema>;
export type ContestRulesValues = z.infer<typeof contestRulesSchema>;
export type ContestAwardsValues = z.infer<typeof contestAwardsSchema>;
export type ContestFinalValues = z.infer<typeof contestFinalSchema>;
