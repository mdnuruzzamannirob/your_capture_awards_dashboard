import { ContestDetailsTabKey } from '@/types';

export const defaultError = {
  title: 'Something Went Wrong',
  body: 'Please try again later. If the issue persists, contact support.',
};
export const contestDetailsTabs: { key: ContestDetailsTabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'rules', label: 'Rules' },
  { key: 'prizes', label: 'Prizes' },
  { key: 'rank', label: 'Rank' },
  { key: 'winners', label: 'Winner' },
];
