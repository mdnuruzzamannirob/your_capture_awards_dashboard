import type { RecurringDetailsValues, RecurringIntervalValues } from '@/lib/schemas/recurringContestSchema';
import type {
  RecurringContest,
  UpdateRecurringContestBody,
  UpdateRecurringIntervalBody,
} from '@/store/features/recurringContest/types';

export function mapRecurringContestToDetailsValues(
  contest: RecurringContest,
): RecurringDetailsValues {
  return {
    title: contest.title,
    category: contest.category ?? '',
    description: contest.description,
    startDate: new Date(contest.startDate),
    endDate: new Date(contest.endDate),
    isMoneyContest: Boolean(contest.isMoneyContest),
    minPrize: Number(contest.minPrize ?? 0),
    maxPrize: Number(contest.maxPrize ?? 0),
    currency: contest.currency ?? undefined,
    entryFeeCoins: Number(contest.entryFeeCoins ?? 0),
  };
}

export function buildUpdateRecurringContestBody(
  values: RecurringDetailsValues,
): UpdateRecurringContestBody {
  return {
    title: values.title,
    category: values.category,
    description: values.description,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate.toISOString(),
    isMoneyContest: values.isMoneyContest,
    minPrize: values.isMoneyContest ? values.minPrize : 0,
    maxPrize: values.isMoneyContest ? values.maxPrize : 0,
    currency: values.isMoneyContest ? (values.currency ?? null) : null,
    entryFeeCoins: values.entryFeeCoins,
  };
}

export function mapRecurringContestToIntervalValues(
  contest: RecurringContest,
): RecurringIntervalValues {
  return {
    recurringType: contest.recurring.recurringType,
    timezone: contest.recurring.timezone ?? 'UTC',
    endsAt: contest.recurring.endsAt ? new Date(contest.recurring.endsAt) : undefined,
    maxOccurrences: contest.recurring.maxOccurrences ?? undefined,
  };
}

export function buildUpdateRecurringIntervalBody(
  values: RecurringIntervalValues,
): UpdateRecurringIntervalBody {
  return {
    recurringType: values.recurringType,
    timezone: values.timezone || 'UTC',
    endsAt: values.endsAt ? values.endsAt.toISOString() : null,
    maxOccurrences: values.maxOccurrences ?? null,
  };
}

export function getRecurrenceLabel(recurringType: string): string {
  switch (recurringType) {
    case 'DAILY':
      return 'Daily';
    case 'WEEKLY':
      return 'Weekly';
    case 'MONTHLY':
      return 'Monthly';
    default:
      return recurringType;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Something went wrong!';
  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }
  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }
  return 'Something went wrong!';
}

export function getRecurringStatusVariant(
  status: RecurringContest['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'PAUSED':
      return 'secondary';
    case 'ENDED':
      return 'destructive';
    default:
      return 'outline';
  }
}
