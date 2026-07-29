import { contestRuleDefinitions } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type {
  Contest,
  ContestAward,
  ContestAwardType,
  ContestRuleKey,
} from '@/store/features/contest/types';
import type { ContestCreationOptions } from '@/store/features/contest/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function getDefaultContestValues(options?: ContestCreationOptions): ContestFinalValues {
  const optionRules = options?.ruleDefinitions?.length ? options.ruleDefinitions : options?.rules;
  const values = Object.fromEntries((optionRules ?? []).map((rule) => [rule.key, rule.value]));
  const fallback = contestRuleDefinitions;
  const submissionRuleList = Array.isArray(values.SUBMISSION_RULES)
    ? (values.SUBMISSION_RULES as string[])
    : null;
  const defaultPrizes = (options?.prizeDefinitions?.length
    ? options.prizeDefinitions
    : options?.prizes ?? []
  ).filter((prize) => prize.isDefault);

  return {
    details: {
      title: '',
      category: '',
      description: '',
      banner: undefined,
      maxUploads: Number(values.SUBMISSION_LIMIT ?? fallback.SUBMISSION_LIMIT.defaultValue),
      recurring: false,
      recurringType: undefined,
      startDate: new Date(Date.now() + 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 60 * 60 * 1000),
    },
    prizes: {
      isMoneyContest: false,
      minPrize: 0,
      maxPrize: 0,
      coin_requirement: false,
      coin_required: 0,
    },
    rules: {
      submissionRules: submissionRuleList
        ? {
            intro: 'Do not post:',
            disallowed: submissionRuleList.slice(0, -1),
            removalNotice: submissionRuleList.at(-1) ?? '',
            allowAiImages: false,
            duplicatePolicy: 'DISALLOW_SAME_PHOTO',
          }
        : clone(fallback.SUBMISSION_RULES.defaultValue) as ContestFinalValues['rules']['submissionRules'],
      levelRequirements: clone(
        values.LEVEL_REQUIREMENTS ?? fallback.LEVEL_REQUIREMENTS.defaultValue,
      ) as ContestFinalValues['rules']['levelRequirements'],
      submissionFormat: clone(
        values.SUBMISSION_FORMAT ?? fallback.SUBMISSION_FORMAT.defaultValue,
      ) as ContestFinalValues['rules']['submissionFormat'],
      eligibility: clone(
        values.ELIGIBILITY ?? fallback.ELIGIBILITY.defaultValue,
      ) as ContestFinalValues['rules']['eligibility'],
      copyright: clone(
        values.COPYRIGHT ?? fallback.COPYRIGHT.defaultValue,
      ) as ContestFinalValues['rules']['copyright'],
      voting: clone(
        values.VOTING ?? fallback.VOTING.defaultValue,
      ) as ContestFinalValues['rules']['voting'],
      participation: clone(
        values.PARTICIPATION ?? fallback.PARTICIPATION.defaultValue,
      ) as ContestFinalValues['rules']['participation'],
    },
    awards: defaultPrizes.map((prize) => ({
      type: prize.type as ContestAwardType,
      boost: prize.rewards.boost,
      key: prize.rewards.key,
      swap: prize.rewards.swap,
      coin: prize.rewards.coin,
    })),
  };
}
function getRuleValue<T>(contest: Contest, key: ContestRuleKey, fallback: T): T {
  const value = contest.rules?.find((rule) => rule.key === key)?.value;
  if (value === undefined || value === null) return clone(fallback);

  if (
    typeof fallback === 'object' &&
    fallback !== null &&
    !Array.isArray(fallback) &&
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return { ...clone(fallback), ...value } as T;
  }

  return clone(value as T);
}

function normalizeAward(award: ContestAward): ContestFinalValues['awards'][number] | null {
  const type = (award.type ?? award.category ?? award.prize?.category) as
    | ContestAwardType
    | undefined;
  if (!type) return null;

  return {
    type,
    recipient: award.recipient,
    boost: Number(award.boost ?? 0),
    key: Number(award.key ?? 0),
    swap: Number(award.swap ?? 0),
    coin: Number(award.coin ?? 0),
  };
}

export function mapContestToFormValues(contest: Contest): ContestFinalValues {
  const defaults = getDefaultContestValues();
  const sourceAwards = contest.prizes?.length ? contest.prizes : contest.awards;
  const awards = (sourceAwards ?? [])
    .map(normalizeAward)
    .filter((award): award is NonNullable<typeof award> => Boolean(award));
  const levelFallback = (
    contest.level_requirements?.length === 5
      ? defaults.rules.levelRequirements.map((item, index) => ({
          ...item,
          votes: Number(contest.level_requirements?.[index] ?? item.votes),
        }))
      : defaults.rules.levelRequirements
  ) as ContestFinalValues['rules']['levelRequirements'];

  const submissionLimit = getRuleValue(
    contest,
    'SUBMISSION_LIMIT',
    contest.maxUploads ?? defaults.details.maxUploads,
  );

  return {
    details: {
      title: contest.title ?? '',
      category: typeof contest.category === 'string' ? contest.category : (contest.category?.id ?? ''),
      description: contest.description ?? '',
      banner: contest.banner ?? undefined,
      maxUploads: Number(submissionLimit),
      recurring: Boolean(contest.recurring),
      recurringType: contest.recurring ? (contest.recurringType ?? 'DAILY') : undefined,
      startDate: contest.startDate ? new Date(contest.startDate) : defaults.details.startDate,
      endDate: contest.endDate ? new Date(contest.endDate) : defaults.details.endDate,
    },
    prizes: {
      isMoneyContest: Boolean(contest.isMoneyContest),
      minPrize: Number(contest.minPrize ?? 0),
      maxPrize: Number(contest.maxPrize ?? 0),
      coin_requirement: Boolean(contest.coin_requirement),
      coin_required: Number(contest.coin_required ?? 0),
    },
    rules: {
      submissionRules: getRuleValue(contest, 'SUBMISSION_RULES', defaults.rules.submissionRules),
      levelRequirements: getRuleValue(contest, 'LEVEL_REQUIREMENTS', levelFallback),
      submissionFormat: getRuleValue(contest, 'SUBMISSION_FORMAT', defaults.rules.submissionFormat),
      eligibility: getRuleValue(contest, 'ELIGIBILITY', defaults.rules.eligibility),
      copyright: getRuleValue(contest, 'COPYRIGHT', defaults.rules.copyright),
      voting: getRuleValue(contest, 'VOTING', defaults.rules.voting),
      participation: getRuleValue(contest, 'PARTICIPATION', defaults.rules.participation),
    },
    awards: awards.length ? awards : defaults.awards,
  };
}

export function buildContestFormData(
  values: ContestFinalValues,
  options?: ContestCreationOptions,
): FormData {
  const { details, prizes, rules, awards } = values;
  const formData = new FormData();
  const definitions = options?.prizeDefinitions?.length
    ? options.prizeDefinitions
    : options?.prizes ?? [];

  formData.append('title', details.title);
  formData.append('description', details.description);
  formData.append('categoryId', details.category);
  formData.append('startDate', details.startDate.toISOString());
  formData.append('endDate', details.endDate.toISOString());
  formData.append('isMoneyContest', String(prizes.isMoneyContest));
  formData.append('entryFeeCoins', String(prizes.coin_requirement ? prizes.coin_required : 0));
  if (details.banner instanceof File) formData.append('banner', details.banner);

  const ruleValues: Record<ContestRuleKey, unknown> = {
    SUBMISSION_LIMIT: details.maxUploads,
    SUBMISSION_RULES: [
      ...rules.submissionRules.disallowed,
      rules.submissionRules.removalNotice,
    ],
    LEVEL_REQUIREMENTS: rules.levelRequirements,
    SUBMISSION_FORMAT: {
      ...rules.submissionFormat,
      mimeTypes: Array.from(new Set(rules.submissionFormat.mimeTypes.map((mimeType) =>
        mimeType === 'image/jpg' ? 'image/jpeg' : mimeType,
      ))),
    },
    ELIGIBILITY: rules.eligibility,
    COPYRIGHT: rules.copyright,
    VOTING: rules.voting,
    PARTICIPATION: {
      ...rules.participation,
      termsUrl: rules.participation.termsUrl || null,
    },
  };
  const optionRules = options?.ruleDefinitions?.length ? options.ruleDefinitions : options?.rules;
  const ruleOrder = optionRules?.map((rule) => rule.key) ?? Object.keys(ruleValues) as ContestRuleKey[];
  formData.append(
    'rules',
    JSON.stringify(
      ruleOrder.map((key, index) => ({
        key,
        value: ruleValues[key],
        enabled: true,
        order: (index + 1) * 10,
      })),
    ),
  );

  formData.append(
    'awards',
    JSON.stringify(
      awards.map(({ type, recipient, boost, key, swap, coin }) => {
        const rankLimit = type.startsWith('TOP_') ? Number(type.slice(4)) : null;
        const target = recipient === 'Photographer' || type === 'TOP_PHOTOGRAPHER'
          ? 'PHOTOGRAPHER'
          : 'PHOTO';
        const definition = definitions.find((prize) =>
          rankLimit
            ? prize.type === 'TOP_RANK' && prize.rankLimit === rankLimit && prize.target === target
            : prize.type === type && prize.target === target,
        );
        return {
          type: definition?.type ?? type,
          target,
          ...(definition?.rankLimit ? { rankLimit: definition.rankLimit } : {}),
          value: { boost, key, swap, coin },
        };
      }),
    ),
  );

  return formData;
}
export function getAwardLabel(type?: string): string {
  if (!type) return 'Award';
  return type
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}




