import { contestRuleDefinitions } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type {
  Contest,
  ContestAward,
  ContestAwardType,
  ContestCreationOptions,
  ContestOptionRule,
  ContestRuleKey,
} from '@/store/features/contest/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const acceptedSubmissionMimeTypes = ['image/jpeg', 'image/png'] as const;

type AcceptedSubmissionMimeType = (typeof acceptedSubmissionMimeTypes)[number];

function getOptionRuleValue(rule: ContestOptionRule): unknown {
  return rule.value ?? rule.defaultValue;
}

function getDefaultRuleKeys(options?: ContestCreationOptions): ContestRuleKey[] {
  const optionRules = options?.ruleDefinitions?.length ? options.ruleDefinitions : options?.rules;
  return (optionRules?.map((rule) => rule.key) ??
    (Object.keys(contestRuleDefinitions) as ContestRuleKey[])) as ContestRuleKey[];
}

function normalizeSubmissionFormat(
  format: ContestFinalValues['rules']['submissionFormat'],
): ContestFinalValues['rules']['submissionFormat'] {
  const mimeTypes = format.mimeTypes.filter((mimeType): mimeType is AcceptedSubmissionMimeType =>
    acceptedSubmissionMimeTypes.includes(mimeType as AcceptedSubmissionMimeType),
  );
  return { ...format, mimeTypes: mimeTypes.length ? mimeTypes : ['image/jpeg'] };
}

export function getDefaultContestValues(options?: ContestCreationOptions): ContestFinalValues {
  const optionRules = options?.ruleDefinitions?.length ? options.ruleDefinitions : options?.rules;
  const selectedRuleKeys = getDefaultRuleKeys(options);
  const values = Object.fromEntries(
    (optionRules ?? []).map((rule) => [rule.key, getOptionRuleValue(rule)]),
  );
  const fallback = contestRuleDefinitions;
  const submissionRuleList = Array.isArray(values.SUBMISSION_RULES)
    ? (values.SUBMISSION_RULES as string[])
    : null;
  const defaultPrizes = (
    options?.prizeDefinitions?.length ? options.prizeDefinitions : (options?.prizes ?? [])
  ).filter((prize) => prize.isDefault && prize.type !== 'YC_PICK');

  return {
    details: {
      title: '',
      category: '',
      description: '',
      banner: undefined,
      maxUploads: Number(values.SUBMISSION_LIMIT ?? fallback.SUBMISSION_LIMIT.defaultValue),
      recurring: false,
      recurringType: undefined,
      recurringTimezone: 'UTC',
      recurringEndsAt: undefined,
      recurringMaxOccurrences: undefined,
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
      selectedRuleKeys,
      submissionRules: submissionRuleList
        ? {
            intro: 'Do not post:',
            disallowed: submissionRuleList.slice(0, -1),
            removalNotice: submissionRuleList.at(-1) ?? '',
            allowAiImages: false,
            duplicatePolicy: 'DISALLOW_SAME_PHOTO',
          }
        : (clone(
            fallback.SUBMISSION_RULES.defaultValue,
          ) as ContestFinalValues['rules']['submissionRules']),
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
      type: (prize.type === 'TOP_RANK' && prize.rankLimit
        ? `TOP_${prize.rankLimit}`
        : prize.type) as ContestAwardType,
      recipient:
        prize.type === 'TOP_RANK'
          ? prize.target === 'PHOTOGRAPHER'
            ? 'Photographer'
            : 'Photo'
          : undefined,
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

function normalizeSubmissionRules(
  value: unknown,
  fallback: ContestFinalValues['rules']['submissionRules'],
): ContestFinalValues['rules']['submissionRules'] {
  if (Array.isArray(value)) {
    const rules = value.filter(
      (item): item is string => typeof item === 'string' && Boolean(item.trim()),
    );
    const disallowed = rules.slice(0, -1);
    return {
      ...clone(fallback),
      disallowed: disallowed.length ? disallowed : clone(fallback.disallowed),
      removalNotice: rules.at(-1) ?? fallback.removalNotice,
      allowAiImages: !rules.some((rule) => /ai[ -]?generated|ai images/i.test(rule)),
    };
  }

  if (value && typeof value === 'object') {
    const ruleValue = value as Partial<ContestFinalValues['rules']['submissionRules']>;
    return {
      ...clone(fallback),
      ...ruleValue,
      disallowed: Array.isArray(ruleValue.disallowed)
        ? ruleValue.disallowed.filter(
            (item): item is string => typeof item === 'string' && Boolean(item.trim()),
          )
        : clone(fallback.disallowed),
    };
  }

  return clone(fallback);
}
function normalizeAward(award: ContestAward): ContestFinalValues['awards'][number] | null {
  const sourceType = award.type ?? award.category ?? award.prize?.category;
  // YC Pick is not used in this project at the moment.
  if (!sourceType || sourceType === 'YC_PICK') return null;

  const type = (
    sourceType === 'TOP_RANK' && award.rankLimit ? `TOP_${award.rankLimit}` : sourceType
  ) as ContestAwardType | undefined;
  if (!type) return null;

  return {
    type,
    recipient:
      award.recipient ??
      (award.target === 'PHOTO'
        ? 'Photo'
        : award.target === 'PHOTOGRAPHER'
          ? 'Photographer'
          : undefined),
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
  const enabledRuleKeys =
    contest.rules?.filter((rule) => rule.enabled !== false).map((rule) => rule.key) ?? [];
  const selectedRuleKeys = enabledRuleKeys.length
    ? enabledRuleKeys
    : defaults.rules.selectedRuleKeys;
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
      category:
        typeof contest.category === 'string' ? contest.category : (contest.category?.name ?? ''),
      description: contest.description ?? '',
      banner: contest.banner ?? undefined,
      maxUploads: Number(submissionLimit),
      recurring: Boolean(contest.recurring),
      recurringType: contest.recurring ? (contest.recurringType ?? 'DAILY') : undefined,
      recurringTimezone: defaults.details.recurringTimezone,
      recurringEndsAt: undefined,
      recurringMaxOccurrences: undefined,
      startDate: contest.startDate ? new Date(contest.startDate) : defaults.details.startDate,
      endDate: contest.endDate ? new Date(contest.endDate) : defaults.details.endDate,
    },
    prizes: {
      isMoneyContest: Boolean(contest.isMoneyContest),
      minPrize: Number(contest.minPrize ?? 0),
      maxPrize: Number(contest.maxPrize ?? 0),
      coin_requirement: Boolean(contest.coinRequirement ?? contest.coin_requirement),
      coin_required: Number(contest.coin_required ?? contest.entryFeeCoins ?? 0),
    },
    rules: {
      selectedRuleKeys,
      submissionRules: normalizeSubmissionRules(
        contest.rules?.find((rule) => rule.key === 'SUBMISSION_RULES')?.value,
        defaults.rules.submissionRules,
      ),
      levelRequirements: getRuleValue(contest, 'LEVEL_REQUIREMENTS', levelFallback),
      submissionFormat: normalizeSubmissionFormat(
        getRuleValue(contest, 'SUBMISSION_FORMAT', defaults.rules.submissionFormat),
      ),
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
  formData.append('title', details.title);
  formData.append('description', details.description);
  formData.append('category', details.category);
  formData.append('startDate', details.startDate.toISOString());
  formData.append('endDate', details.endDate.toISOString());
  formData.append('recurring', String(details.recurring));
  if (details.recurring) {
    formData.append(
      'recurrence',
      JSON.stringify({
        type: details.recurringType ?? 'DAILY',
        timezone: details.recurringTimezone || 'UTC',
        ...(details.recurringEndsAt ? { endsAt: details.recurringEndsAt.toISOString() } : {}),
        ...(details.recurringMaxOccurrences
          ? { maxOccurrences: details.recurringMaxOccurrences }
          : {}),
      }),
    );
  }
  formData.append('isMoneyContest', String(prizes.isMoneyContest));
  if (prizes.isMoneyContest) {
    formData.append('minPrize', String(prizes.minPrize));
    formData.append('maxPrize', String(prizes.maxPrize));
  }
  formData.append('coinRequirement', String(prizes.coin_requirement));
  if (prizes.coin_requirement) {
    formData.append('entryFeeCoins', String(prizes.coin_required));
  }
  if (details.banner instanceof File) formData.append('banner', details.banner);

  const ruleValues: Record<ContestRuleKey, unknown> = {
    SUBMISSION_LIMIT: details.maxUploads,
    SUBMISSION_RULES: [...rules.submissionRules.disallowed, rules.submissionRules.removalNotice],
    LEVEL_REQUIREMENTS: rules.levelRequirements,
    SUBMISSION_FORMAT: {
      ...rules.submissionFormat,
      mimeTypes: Array.from(new Set(rules.submissionFormat.mimeTypes)),
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
  const selectedRuleKeys = new Set(
    rules.selectedRuleKeys.length
      ? rules.selectedRuleKeys
      : (Object.keys(ruleValues) as ContestRuleKey[]),
  );
  const ruleOrder =
    optionRules?.map((rule) => rule.key) ?? (Object.keys(ruleValues) as ContestRuleKey[]);
  const ruleOrders = new Map(optionRules?.map((rule) => [rule.key, rule.order]));
  const selectedRuleOrder = ruleOrder.filter((key) => selectedRuleKeys.has(key));
  formData.append(
    'rules',
    JSON.stringify(
      selectedRuleOrder.map((key, index) => ({
        key,
        value: ruleValues[key],
        enabled: true,
        order: ruleOrders.get(key) ?? contestRuleDefinitions[key]?.order ?? (index + 1) * 10,
      })),
    ),
  );

  formData.append(
    'prizes',
    JSON.stringify(
      awards.map(({ type, recipient, boost, key, swap, coin }) => {
        const isTopRank = /^TOP_\d+$/.test(type);
        const rankLimit = isTopRank ? Number(type.slice(4)) : null;
        const target =
          recipient === 'Photographer' || type === 'TOP_PHOTOGRAPHER' ? 'PHOTOGRAPHER' : 'PHOTO';
        return {
          type: isTopRank ? 'TOP_RANK' : type,
          target,
          ...(rankLimit ? { rankLimit } : {}),
          coin,
          boost,
          swap,
          key,
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
