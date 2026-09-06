export const contestRuleKeys = [
  'SUBMISSION_LIMIT',
  'SUBMISSION_RULES',
  'LEVEL_REQUIREMENTS',
  'SUBMISSION_FORMAT',
  'ELIGIBILITY',
  'COPYRIGHT',
  'VOTING',
  'PARTICIPATION',
] as const;

export type ContestRuleKey = (typeof contestRuleKeys)[number];

export const contestAwardTypes = [
  'TOP_PHOTO',
  'TOP_PHOTOGRAPHER',
  'AMATEUR',
  'TALENTED',
  'SUPREME',
  'SUPERIOR',
  'YC_PICK',
  'TOP_200',
  'TOP_100',
  'TOP_50',
  'TOP_20',
  'TOP_10',
  'WINNER',
] as const;

export type ContestAwardType = (typeof contestAwardTypes)[number];
export type ContestLevel = 'AMATEUR' | 'TALENTED' | 'SUPREME' | 'SUPERIOR' | 'TOP_NOTCH';

export interface LevelRequirement {
  level: ContestLevel;
  votes: number;
}

export interface SubmissionRulesValue {
  intro: string;
  disallowed: string[];
  removalNotice: string;
  allowAiImages: boolean;
  duplicatePolicy: string;
}

export interface SubmissionFormatValue {
  mimeTypes: string[];
  minWidth: number;
  minHeight: number;
  maxSizeMB: number;
}

export interface EligibilityValue {
  minAge: number;
  text: string;
  requiresAcceptance: boolean;
}

export interface CopyrightValue {
  text: string;
  requiresOwnership: boolean;
  requiresAcceptance: boolean;
}

export interface VotingValue {
  text: string;
  membersOnly: boolean;
  requireContestParticipant: boolean;
  disallowSelfVote: boolean;
  blindVoting: boolean;
}

export interface ParticipationValue {
  text: string;
  requiresTermsAcceptance: boolean;
  termsUrl: string | null;
}

export type ContestRuleValue =
  | number
  | SubmissionRulesValue
  | LevelRequirement[]
  | SubmissionFormatValue
  | EligibilityValue
  | CopyrightValue
  | VotingValue
  | ParticipationValue;

export interface ContestRule {
  key: ContestRuleKey;
  label?: string;
  name?: string;
  icon?: string;
  inputType?: 'number' | 'object' | 'list';
  appliesTo?: string[];
  displayOnly?: boolean;
  enabled?: boolean;
  order?: number;
  value: ContestRuleValue;
  description?: string;
}

export interface ContestAwardValue {
  boost: number;
  key: number;
  swap: number;
  coin: number;
}

export interface ContestAward extends Partial<ContestAwardValue> {
  id?: string;
  contestId?: string;
  prizeId?: string;
  type?: ContestAwardType | 'TOP_RANK';
  recipient?: 'Photo' | 'Photographer';
  target?: 'PHOTO' | 'PHOTOGRAPHER';
  rankLimit?: number | null;
  category: ContestAwardType | 'TOP_RANK';
  title?: string;
  description?: string;
  icon?: string;
  prize?: {
    id?: string;
    category?: ContestAwardType;
    title?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  };
}

export interface ContestLevelAward extends ContestAwardValue {
  id?: string;
  contestId?: string;
  level: ContestLevel;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContestWinnerUser {
  id?: string;
  avatar?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}

export interface ContestWinnerPhoto {
  id?: string;
  title?: string | null;
  contestId?: string;
  participantId?: string;
  photoId?: string;
  rank?: number | null;
  photo?: {
    id?: string;
    url?: string | null;
    title?: string | null;
  } | null;
}

export interface ContestWinner {
  id?: string;
  category?: ContestAwardType | 'TOP_RANK' | string;
  type?: ContestAwardType | 'TOP_RANK' | string;
  target?: 'PHOTO' | 'PHOTOGRAPHER' | string;
  rank?: number | null;
  user?: ContestWinnerUser | null;
  photo?: ContestWinnerPhoto | null;
  participant?: {
    id?: string;
    user?: ContestWinnerUser | null;
  } | null;
}

export interface RankedPhoto {
  contestPhotoId?: string;
  userPhotoId?: string;
  id?: string;
  url?: string | null;
  title?: string | null;
  voteCount?: number;
  rank?: number;
  photographer?: ContestWinnerUser | null;
  user?: ContestWinnerUser | null;
}

export interface RankedPhotographer {
  participantId?: string;
  id?: string;
  rank?: number;
  levelRank?: number;
  level?: string;
  user?: ContestWinnerUser | null;
  photos?: RankedPhoto[];
  totalVotes?: number;
}

export interface RankedPhotosResponse {
  photos: RankedPhoto[];
  meta?: unknown;
}

export interface RankedPhotographersResponse {
  contestTotalVotes?: number;
  levelTabs?: string[];
  participants: RankedPhotographer[];
  meta?: unknown;
}

export interface Contest {
  id: string;
  title: string;
  category?: string | { id?: string; name?: string };
  categoryId?: string | null;
  description: string;
  banner?: string | null;
  status: 'ACTIVE' | 'UPCOMING' | 'CLOSED' | string;
  startDate?: string;
  endDate?: string;
  recurring?: boolean;
  recurringType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
  isMoneyContest?: boolean;
  minPrize?: number;
  maxPrize?: number;
  currency?: string | null;
  coin_requirement?: boolean;
  coinRequirement?: boolean;
  coin_required?: number;
  entryFeeCoins?: number;
  maxUpload?: number;
  maxUploads?: number;
  level_requirements?: number[];
  rules?: ContestRule[];
  prizes?: ContestAward[];
  awards?: ContestAward[];
  levelAwards?: ContestLevelAward[];
  totalVotes?: number;
  joined?: boolean;
  createdAt?: string;
  updatedAt?: string;
  creator?: {
    id?: string;
    fullName?: string;
    email?: string;
    avatar?: string | null;
  };
  rankPhotos?: RankedPhoto[];
  rankPhotographers?: RankedPhotographer[];
  rank?: {
    photos?: RankedPhoto[];
    photographers?: RankedPhotographer[];
  };
  winners?: ContestWinner[] | { data?: ContestWinner[] };
}

export interface GetContestsResponse {
  contests: Contest[];
  total?: number;
  count?: number;
  page: number;
  limit: number;
}

export interface ContestCreationOptions {
  categories: Array<{ id: string; name: string; slug?: string }>;
  ruleDefinitions: ContestOptionRule[];
  prizeDefinitions: ContestPrizeDefinition[];
  rules: ContestOptionRule[];
  prizes: ContestPrizeDefinition[];
  supportedImageMimeTypes: string[];
}

export interface ContestOptionRule {
  key: ContestRuleKey;
  label: string;
  description?: string;
  icon?: string;
  inputType: 'number' | 'object' | 'list';
  value?: unknown;
  defaultValue?: unknown;
  appliesTo?: string[];
  displayOnly?: boolean;
  order?: number;
  payload?: Partial<Record<ContestRuleKey, unknown>>;
}

export interface ContestPrizeDefinition {
  prizeId: string;
  title: string;
  description?: string;
  type: 'TOP_PHOTO' | 'TOP_PHOTOGRAPHER' | 'WINNER' | 'YC_PICK' | 'TOP_RANK';
  target: 'PHOTO' | 'PHOTOGRAPHER';
  rankLimit: number | null;
  rewards: ContestAwardValue;
  isDefault: boolean;
  payload: { prizeId: string } & ContestAwardValue;
}

export interface ContestStats {
  running: number;
  upcoming: number;
  completed: number;
}

export interface ContestParticipant {
  id: string;
  contestId: string;
  userId: string;
  status: 'ACTIVE' | 'BLOCKED';
  level?: string;
  rank?: number | null;
  exposure_bonus?: number;
  user?: {
    id: string;
    username: string | null;
    fullName: string | null;
    email: string;
    avatar: string | null;
  };
}

export interface ContestPhotoSubmission {
  id: string;
  title?: string | null;
  contestId: string;
  participantId: string;
  rank?: number | null;
  promoted?: boolean;
  photo?: { id: string; url: string; title?: string | null } | null;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}
