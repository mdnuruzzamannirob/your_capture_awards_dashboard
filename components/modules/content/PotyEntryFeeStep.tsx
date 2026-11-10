'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MIN_PAID_ENTRY_FEE_USD, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useFormContext } from 'react-hook-form';

// Photographer of the Year is free (fee 0) or paid. Paid entry fees form a pot. This share of it is
// the prize pool divided among the winners and the rest is kept by the platform
// (see the backend's POTY_PRIZE_POOL_SHARE_PERCENT). Admin-only; the public
// website shows the pool amount without the percentages.
const PRIZE_POOL_SHARE_PERCENT = 40;
const PLATFORM_SHARE_PERCENT = 100 - PRIZE_POOL_SHARE_PERCENT;

const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';

const PotyEntryFeeStep = ({
  locked = false,
  lockedReason = 'contest has started',
}: {
  locked?: boolean;
  lockedReason?: string;
}) => {
  const form = useFormContext<ContestFinalValues>();
  const isFree = Number(form.watch('prizes.entryFeeAmount') ?? 0) === 0;

  return (
    <div className="border-border-subtle bg-surface-secondary space-y-3 rounded-lg border p-4">
      <div>
        <p className="text-sm font-semibold">Entry fee &amp; prize pool</p>
        <p className="text-muted-foreground mt-1 text-xs leading-5">
          Set the fee to 0 for a free contest, or charge at least $
          {MIN_PAID_ENTRY_FEE_USD.toFixed(2)}. When there is a fee, {PRIZE_POOL_SHARE_PERCENT}% of
          all collected fees becomes the prize pool divided among the winners, and{' '}
          {PLATFORM_SHARE_PERCENT}% is kept by the platform. Judges review every submitted photo in
          Settings, the top 10 are advanced automatically by ranking, then judges choose the
          winners.
        </p>
      </div>
      <FormField
        control={form.control}
        name="prizes.entryFeeAmount"
        render={({ field }) => (
          <FormItem className="max-w-[220px] gap-1.5">
            <FormLabel className={labelClass}>
              Entry fee (USD){locked ? ` (locked, ${lockedReason})` : ''}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                // 0 is allowed (free contest). The browser's own min check would
                // otherwise block submitting 0; the schema enforces the paid minimum.
                min={0}
                step="0.01"
                inputMode="decimal"
                className={inputClass}
                {...field}
                // After the spread: the field object carries its own `disabled`.
                disabled={locked}
                onChange={(event) => field.onChange(event.target.value)}
              />
            </FormControl>
            <p className="text-muted-foreground text-[11px]">
              {isFree
                ? 'Free contest: anyone can join without paying.'
                : 'Paid contest: entrants pay through Stripe.'}
            </p>
            <FormMessage className="text-[9px]" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PotyEntryFeeStep;
