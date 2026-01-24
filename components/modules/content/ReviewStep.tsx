'use client';

import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';

const ReviewStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const values = form.getValues();
  const isMoney = values.prizes.isMoneyContest;

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="flex items-center gap-2 border-b border-gray-800 pb-4 text-lg font-semibold">
        <Eye className="size-5 text-cyan-400" /> Final Review
      </h2>

      <div className="space-y-4 text-sm text-gray-200">
        <div className="rounded-lg border border-gray-800 p-4">
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

        <div className="rounded-lg border border-gray-800 p-4">
          <p className="font-semibold">Prizes</p>
          <p>Type: {values.prizes.type}</p>
          <p>Money contest: {isMoney ? 'Yes' : 'No'}</p>
          {isMoney && (
            <p>
              Prize Range: ₹{values.prizes.minPrize} - ₹{values.prizes.maxPrize}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-gray-800 p-4">
          <p className="font-semibold">Rules ({values.rules.length})</p>
          <ul className="list-disc space-y-1 pl-5 text-gray-300">
            {values.rules.map((rule, idx) => (
              <li key={idx}>
                {rule.name} — {rule.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-800 p-4">
          <p className="font-semibold">Rewards ({values.rewards.length})</p>
          <ul className="list-disc space-y-1 pl-5 text-gray-300">
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
