import { ContestDetailsTabKey } from '@/types';
import type {
  ContestAwardType,
  ContestRuleKey,
  ContestRuleValue,
} from '@/store/features/contest/types';

export const DEFAULT_ERROR = {
  title: 'Something Went Wrong',
  body: 'Please try again later. If the issue persists, contact support.',
};
export const CONTEST_DETAILS_TABS: { key: ContestDetailsTabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'rules', label: 'Rules' },
  { key: 'prizes', label: 'Awards' },
  { key: 'rank', label: 'Rank' },
  { key: 'winners', label: 'Winners' },
];

export interface ContestRuleDefinition {
  key: ContestRuleKey;
  label: string;
  icon: string;
  inputType: 'number' | 'object' | 'list';
  defaultValue: ContestRuleValue;
  appliesTo: string[];
  displayOnly: boolean;
  order: number;
}

export const contestRuleDefinitions: Record<ContestRuleKey, ContestRuleDefinition> = {
  SUBMISSION_LIMIT: {
    key: 'SUBMISSION_LIMIT',
    label: 'Submission Limit',
    icon: 'number-circle',
    inputType: 'number',
    defaultValue: 4,
    appliesTo: ['PHOTO_UPLOAD', 'DISPLAY'],
    displayOnly: false,
    order: 10,
  },
  SUBMISSION_RULES: {
    key: 'SUBMISSION_RULES',
    label: 'Submission Rules',
    icon: 'image-upload',
    inputType: 'object',
    defaultValue: {
      intro: 'Do not post:',
      disallowed: [
        'Non-relevant images',
        'Similar images: Images with the same combination of subject, background, foreground and location are not allowed. Images must be distinct',
        'Same image multiple times (cropped, angle change or tone changes)',
        'AI images',
        'Images you do not own or do not have permission to submit',
        'Images with visible watermarks, logos, signatures, borders, or added text',
        'Obscene, hateful, violent, sexually explicit, or otherwise offensive content',
        'Photos that violate privacy or are submitted without required model or property releases',
        'Misleading edits or composites that are not disclosed in the caption',
        'Photos taken outside the contest stated capture period',
      ],
      removalNotice: "Images that don't comply may be removed from the challenge.",
      allowAiImages: false,
      duplicatePolicy: 'DISALLOW_SAME_PHOTO',
    },
    appliesTo: ['PHOTO_UPLOAD', 'DISPLAY'],
    displayOnly: false,
    order: 20,
  },
  LEVEL_REQUIREMENTS: {
    key: 'LEVEL_REQUIREMENTS',
    label: 'Level Requirements',
    icon: 'level-stars',
    inputType: 'list',
    defaultValue: [
      { level: 'AMATEUR', votes: 50 },
      { level: 'TALENTED', votes: 250 },
      { level: 'SUPREME', votes: 900 },
      { level: 'SUPERIOR', votes: 1900 },
      { level: 'TOP_NOTCH', votes: 5000 },
    ],
    appliesTo: ['RANKING', 'DISPLAY'],
    displayOnly: false,
    order: 30,
  },
  SUBMISSION_FORMAT: {
    key: 'SUBMISSION_FORMAT',
    label: 'Submission Format',
    icon: 'image-plus',
    inputType: 'object',
    defaultValue: {
      mimeTypes: ['image/jpeg'],
      minWidth: 700,
      minHeight: 700,
      maxSizeMB: 25,
    },
    appliesTo: ['PHOTO_UPLOAD', 'DISPLAY'],
    displayOnly: false,
    order: 40,
  },
  ELIGIBILITY: {
    key: 'ELIGIBILITY',
    label: 'Eligibility',
    icon: 'file-check',
    inputType: 'object',
    defaultValue: {
      minAge: 18,
      text: 'Open to all photographers ages 18 and above. Photos must not contain obscene, provocative, defamatory, sexually explicit, or otherwise objectionable or inappropriate content. Photos deemed inappropriate will be disqualified. Challenge void where prohibited.',
      requiresAcceptance: true,
    },
    appliesTo: ['JOIN', 'DISPLAY'],
    displayOnly: false,
    order: 50,
  },
  COPYRIGHT: {
    key: 'COPYRIGHT',
    label: 'Copyright',
    icon: 'copyright',
    inputType: 'object',
    defaultValue: {
      text: 'You maintain the copyright to all photos you submit. You must own every submitted image. If you submit images that do not belong to you, your account may be permanently removed.',
      requiresOwnership: true,
      requiresAcceptance: true,
    },
    appliesTo: ['JOIN', 'PHOTO_UPLOAD', 'DISPLAY'],
    displayOnly: false,
    order: 60,
  },
  VOTING: {
    key: 'VOTING',
    label: 'Voting',
    icon: 'vote',
    inputType: 'object',
    defaultValue: {
      text: 'Voting is done by members of the site only. The voting system uses a "blind voting" method designed to keep voting as fair as possible.',
      membersOnly: true,
      requireContestParticipant: true,
      disallowSelfVote: true,
      blindVoting: true,
    },
    appliesTo: ['VOTING', 'DISPLAY'],
    displayOnly: false,
    order: 70,
  },
  PARTICIPATION: {
    key: 'PARTICIPATION',
    label: 'Participation',
    icon: 'user',
    inputType: 'object',
    defaultValue: {
      text: 'By entering this challenge, you accept the standard Terms of Use.',
      requiresTermsAcceptance: true,
      termsUrl: null,
    },
    appliesTo: ['JOIN', 'DISPLAY'],
    displayOnly: false,
    order: 80,
  },
};

export const CONTEST_LEVELS = ['AMATEUR', 'TALENTED', 'SUPREME', 'SUPERIOR', 'TOP_NOTCH'] as const;

export const CONTEST_AWARD_OPTIONS: Array<{
  value: ContestAwardType;
  label: string;
  icon: string;
}> = [
  { value: 'TOP_PHOTO', label: 'Top Photo', icon: 'Image' },
  { value: 'TOP_PHOTOGRAPHER', label: 'Top Photographer', icon: 'UserRound' },
  { value: 'AMATEUR', label: 'Amateur', icon: 'Camera' },
  { value: 'TALENTED', label: 'Talented', icon: 'Sparkles' },
  { value: 'SUPREME', label: 'Supreme', icon: 'Crown' },
  { value: 'SUPERIOR', label: 'Superior', icon: 'Gem' },
  { value: 'YC_PICK', label: 'YC Pick', icon: 'BadgeCheck' },
  { value: 'TOP_100', label: 'Top 100', icon: 'Medal' },
  { value: 'TOP_50', label: 'Top 50', icon: 'Medal' },
  { value: 'TOP_20', label: 'Top 20', icon: 'Medal' },
  { value: 'TOP_10', label: 'Top 10', icon: 'Trophy' },
  { value: 'WINNER', label: 'Winner', icon: 'Trophy' },
];

export const RECURRING_TYPES = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;
export type RecurringType = (typeof RECURRING_TYPES)[number];
