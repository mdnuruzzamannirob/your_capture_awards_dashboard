import type { RecurringDetailsValues, RecurringIntervalValues } from '@/lib/schemas/recurringContestSchema';
import { getContestCategories } from '@/lib/contestCategories';
import type {
  RecurringContest,
  UpdateRecurringIntervalBody,
} from '@/store/features/recurringContest/types';

export function mapRecurringContestToDetailsValues(
  contest: RecurringContest,
): RecurringDetailsValues {
  return {
    title: contest.title,
    categories: getContestCategories(contest),
    description: contest.description,
    banner: contest.banner ?? undefined,
    bannerUserPhotoId: undefined,
    applyToUpcoming: true,
    startDate: new Date(contest.startDate),
    endDate: new Date(contest.endDate),
    isMoneyContest: Boolean(contest.isMoneyContest),
    minPrize: Number(contest.minPrize ?? 0),
    maxPrize: Number(contest.maxPrize ?? 0),
    currency: contest.currency ?? undefined,
    entryFeeAmount: Number(contest.entryFeeAmount ?? 0),
    entryFeeCoins: Number(contest.entryFeeCoins ?? 0),
  };
}

// Multipart so a new banner file can travel with the other details. Contests
// generated from the template after this edit use the updated values.
export function buildUpdateRecurringContestFormData(values: RecurringDetailsValues): FormData {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('categories', JSON.stringify(values.categories ?? []));
  formData.append('description', values.description);
  formData.append('startDate', values.startDate.toISOString());
  formData.append('endDate', values.endDate.toISOString());
  formData.append('isMoneyContest', String(values.isMoneyContest));
  formData.append('minPrize', String(values.isMoneyContest ? values.minPrize : 0));
  formData.append('maxPrize', String(values.isMoneyContest ? values.maxPrize : 0));
  // An empty value clears the currency on the API side.
  formData.append('currency', values.isMoneyContest ? (values.currency ?? '') : '');
  formData.append('entryFeeAmount', String(values.entryFeeAmount));
  formData.append('entryFeeCoins', String(values.entryFeeCoins));
  formData.append('applyToUpcoming', String(values.applyToUpcoming));
  if (values.bannerUserPhotoId) {
    formData.append('bannerUserPhotoId', values.bannerUserPhotoId);
  } else if (values.banner instanceof File) {
    formData.append('banner', values.banner);
  }
  return formData;
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
