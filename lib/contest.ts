import { contestRuleDefinitions } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type {
  Contest,
  ContestAward,
  ContestAwardType,
  ContestRuleKey,
} from '@/store/features/contest/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function getDefaultContestValues(): ContestFinalValues {
  return {
    details: {
      title: '',
      category: '',
      description: '',
      banner: undefined,
      maxUploads: contestRuleDefinitions.SUBMISSION_LIMIT.defaultValue as number,
      recurring: false,
      recurringType: undefined,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    prizes: {
      isMoneyContest: false,
      minPrize: 0,
      maxPrize: 0,
      coin_requirement: false,
      coin_required: 0,
    },
    rules: {
      submissionRules: clone(
        contestRuleDefinitions.SUBMISSION_RULES.defaultValue,
      ) as ContestFinalValues['rules']['submissionRules'],
      levelRequirements: clone(
        contestRuleDefinitions.LEVEL_REQUIREMENTS.defaultValue,
      ) as ContestFinalValues['rules']['levelRequirements'],
      submissionFormat: clone(
        contestRuleDefinitions.SUBMISSION_FORMAT.defaultValue,
      ) as ContestFinalValues['rules']['submissionFormat'],
      eligibility: clone(
        contestRuleDefinitions.ELIGIBILITY.defaultValue,
      ) as ContestFinalValues['rules']['eligibility'],
      copyright: clone(
        contestRuleDefinitions.COPYRIGHT.defaultValue,
      ) as ContestFinalValues['rules']['copyright'],
      voting: clone(
        contestRuleDefinitions.VOTING.defaultValue,
      ) as ContestFinalValues['rules']['voting'],
      participation: clone(
        contestRuleDefinitions.PARTICIPATION.defaultValue,
      ) as ContestFinalValues['rules']['participation'],
    },
    awards: [
      { type: 'TOP_PHOTO', boost: 10, key: 1, swap: 1, coin: 500 },
      { type: 'TOP_PHOTOGRAPHER', boost: 20, key: 2, swap: 2, coin: 1000 },
    ],
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
      category: contest.category ?? '',
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

export function buildContestFormData(values: ContestFinalValues): FormData {
  const { details, prizes, rules, awards } = values;
  const formData = new FormData();

  formData.append('title', details.title);
  formData.append('category', details.category);
  formData.append('description', details.description);
  formData.append('startDate', details.startDate.toISOString());
  formData.append('endDate', details.endDate.toISOString());
  formData.append('recurring', String(details.recurring));
  if (details.recurringType) formData.append('recurringType', details.recurringType);
  formData.append('isMoneyContest', String(prizes.isMoneyContest));
  formData.append('minPrize', String(prizes.minPrize));
  formData.append('maxPrize', String(prizes.maxPrize));
  formData.append('coin_requirement', String(prizes.coin_requirement));
  formData.append('coin_required', String(prizes.coin_required));
  formData.append('maxUploads', String(details.maxUploads));
  if (details.banner instanceof File) formData.append('banner', details.banner);

  rules.levelRequirements.forEach(({ votes }) => {
    formData.append('level_requirements', String(votes));
  });

  formData.append(
    'rules',
    JSON.stringify([
      { type: 'SUBMISSION_LIMIT', value: details.maxUploads },
      { type: 'SUBMISSION_RULES', value: rules.submissionRules },
      { type: 'LEVEL_REQUIREMENTS', value: rules.levelRequirements },
      { type: 'SUBMISSION_FORMAT', value: rules.submissionFormat },
      { type: 'ELIGIBILITY', value: rules.eligibility },
      { type: 'COPYRIGHT', value: rules.copyright },
      { type: 'VOTING', value: rules.voting },
      {
        type: 'PARTICIPATION',
        value: {
          ...rules.participation,
          termsUrl: rules.participation.termsUrl || null,
        },
      },
    ]),
  );

  formData.append(
    'awards',
    JSON.stringify(
      awards.map(({ type, recipient, boost, key, swap, coin }) => ({
        type,
        ...(recipient ? { recipient } : {}),
        value: { boost, key, swap, coin },
      })),
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
