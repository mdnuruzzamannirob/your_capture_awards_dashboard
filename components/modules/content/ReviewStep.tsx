'use client';

import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';

const ReviewStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const values = form.getValues();

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <h2 className="flex items-center gap-2 border-b border-border pb-4 text-lg font-semibold">
        <Eye className="size-5 text-primary" /> Final Review
      </h2>

      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="rounded-lg border border-border p-4">
          <p className="font-semibold">Details</p>
          <p>Title: {values.details.title || '—'}</p>
          <p>Description: {values.details.description ? 'Provided' : 'Missing'}</p>
          <p>Max Uploads: {values.details.maxUploads}</p>
          <p>
            Dates: {values.details.startDate ? format(values.details.startDate, 'PPp') : '—'} →{' '}
            {values.details.endDate ? format(values.details.endDate, 'PPp') : '—'}
          </p>
          <p>
            Recurring: {values.details.recurring ? values.details.recurringType || 'Yes' : 'No'}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="font-semibold">Coins</p>
          <p>Money contest: {values.prizes.isMoneyContest ? 'Yes' : 'No'}</p>
          {values.prizes.isMoneyContest && (
            <p>
              Prize Range: {values.prizes.minPrize} - {values.prizes.maxPrize}
            </p>
          )}
          <p>Coin requirement: {values.prizes.coin_requirement ? 'Yes' : 'No'}</p>
          {values.prizes.coin_requirement && <p>Required coins: {values.prizes.coin_required}</p>}
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="font-semibold">Rules ({values.rules.length})</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {values.rules.map((rule, idx) => (
              <li key={idx}>
                {rule.name} - {rule.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="font-semibold">Rewards ({values.rewards.length})</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {values.rewards.map((reward, idx) => (
              <li key={idx}>
                {reward.category}: Keys {reward.key}, Boost {reward.boost}, Swap {reward.swap}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
