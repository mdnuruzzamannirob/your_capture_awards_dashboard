import { ContestDetailsTabKey } from '@/types';
import {
  AlertCircle,
  ClipboardCheck,
  // Crown,
  DollarSign,
  FileText,
  ImageIcon,
  Info,
  Lightbulb,
  RotateCw,
  Scale,
  Scissors,
  TrendingUp,
  Trophy,
  User,
  Zap,
} from 'lucide-react';

export const DEFAULT_ERROR = {
  title: 'Something Went Wrong',
  body: 'Please try again later. If the issue persists, contact support.',
};
export const CONTEST_DETAILS_TABS: { key: ContestDetailsTabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'rules', label: 'Rules' },
  { key: 'prizes', label: 'Prizes' },
  { key: 'rank', label: 'Rank' },
  { key: 'winners', label: 'Winner' },
];
export const CREATE_CONTEST_STEPS = [
  {
    id: 0,
    title: 'Details',
    icon: FileText,
    fields: ['title', 'description', 'startDate', 'endDate'],
  },
  { id: 1, title: 'Rules', icon: Scale, fields: ['rules'] },
  { id: 2, title: 'Prizes', icon: Trophy, fields: ['prizes'] },
  { id: 3, title: 'Review', icon: ClipboardCheck, fields: [] },
];

export const CREATE_CONTEST_RULE_ICONS = [
  { value: 'info', label: 'General', icon: Info },
  { value: 'alert', label: 'Warning', icon: AlertCircle },
  { value: 'star', label: 'Important', icon: TrendingUp },
  { value: 'editing_limit', label: 'Editing Limit', icon: Scissors },
  { value: 'money', label: 'Financial', icon: DollarSign },
  { value: 'boost', label: 'Boost Use', icon: Zap },
  { value: 'swap', label: 'Swap Use', icon: RotateCw },
  { value: 'idea', label: 'Theme/Concept', icon: Lightbulb },
];

export const CREATE_CONTEST_PRIZE_TYPES = [
  { value: 'TOP_PHOTO', label: 'Top Photo', icon: ImageIcon },
  { value: 'TOP_PHOTOGRAPHER', label: 'Top Photographer', icon: User },
  // { value: 'yc_top_winner', label: 'YC Top Choice', icon: Crown },
];
export const RECURRING_TYPES = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;
export type RecurringType = (typeof RECURRING_TYPES)[number];
