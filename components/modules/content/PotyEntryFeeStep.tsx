'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useFormContext } from 'react-hook-form';

// Photographer of the Year is paid: entry fees form a pot and this share of it
// is split between the 1st, 2nd and 3rd place winners (see the backend's
// POTY_PRIZE_POOL_SHARE_PERCENT).
const PRIZE_POOL_SHARE_PERCENT = 60;

const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';

const PotyEntryFeeStep = () => {
  const form = useFormContext<ContestFinalValues>();

  return (
    <div className="border-border-subtle bg-surface-secondary space-y-3 rounded-lg border p-4">
      <div>
        <p className="text-sm font-semibold">Entry fee &amp; prize pool</p>
        <p className="text-muted-foreground mt-1 text-xs leading-5">
          Every participant pays the configured fee to join. {PRIZE_POOL_SHARE_PERCENT}% of all collected fees becomes
          the prize pool shared by the 1st, 2nd and 3rd place winners. Judges review every submitted
          photo in Settings, the top 10 are advanced automatically by ranking, then judges choose the three winners.
        </p>
      </div>
      <FormField
        control={form.control}
        name="prizes.entryFeeAmount"
        render={({ field }) => (
          <FormItem className="max-w-[220px] gap-1.5">
            <FormLabel className={labelClass}>Entry fee (USD)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0.5}
                step="0.01"
                className={inputClass}
                {...field}
                onChange={(event) => field.onChange(event.target.value)}
              />
            </FormControl>
            <FormMessage className="text-[9px]" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PotyEntryFeeStep;
