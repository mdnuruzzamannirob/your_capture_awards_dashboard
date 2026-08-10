import type { ApiSuccessResponse, Contest, ContestAwardType, ContestRule } from '@/store/features/contest/types';

export type RecurringType = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type RecurringContestStatus = 'ACTIVE' | 'PAUSED' | 'ENDED';

export interface RecurringData {
  recurringType: RecurringType;
  previousOccurrence?: string | null;
  nextOccurrence: string;
  duration: number;
  timezone?: string | null;
  endsAt?: string | null;
  maxOccurrences?: number | null;
  generatedOccurrences?: number | null;
}

export interface RecurringContestAward {
  id: string;
  category: ContestAwardType | 'TOP_RANK';
  type?: string | null;
  target?: 'PHOTO' | 'PHOTOGRAPHER' | null;
  rankLimit?: number | null;
  slotKey?: string | null;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  boost: number;
  swap: number;
  key: number;
  coin: number;
  enabled: boolean;
  order: number;
  recurringContestId: string;
  prizeId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecurringContest {
  id: string;
  title: string;
  description: string;
  banner?: string | null;
  isMoneyContest: boolean;
  maxPrize?: number | null;
  minPrize?: number | null;
  currency?: string | null;
  entryFeeCoins: number;
  startDate: string;
  endDate: string;
  creatorId: string;
  category?: string | null;
  status: RecurringContestStatus;
  recurring: RecurringData;
  lastGeneratedContestId?: string | null;
  rules?: ContestRule[];
  contestAwards?: RecurringContestAward[];
  createdAt: string;
  updatedAt: string;
}

export interface GetRecurringContestsResponse {
  recurringContests: RecurringContest[];
  total: number;
  page: number;
  limit: number;
}

export interface GetGeneratedContestsResponse {
  contests: Contest[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateRecurringContestBody {
  title?: string;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  isMoneyContest?: boolean;
  maxPrize?: number;
  minPrize?: number;
  currency?: string | null;
  entryFeeCoins?: number;
}

export interface UpdateRecurringIntervalBody {
  recurringType: RecurringType;
  nextOccurrence?: string;
  timezone?: string;
  endsAt?: string | null;
  maxOccurrences?: number | null;
}

export interface ReplaceRecurringAwardsBody {
  awardPrizeIds?: string[];
}

export type { ApiSuccessResponse };
