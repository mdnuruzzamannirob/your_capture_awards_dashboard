'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useFormContext } from 'react-hook-form';

const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';

function FormSwitch({
  name,
  label,
}: {
  name: 'prizes.isMoneyContest' | 'prizes.coin_requirement';
  label: string;
}) {
  const form = useFormContext<ContestFinalValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-[9px] space-y-0">
          <FormLabel className="text-body order-1 mt-0! text-[11px] font-medium">{label}</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} className="order-2" />
          </FormControl>
          <FormMessage className="text-[9px]" />
        </FormItem>
      )}
    />
  );
}

const PrizesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const isMoneyContest = form.watch('prizes.isMoneyContest');
  const coinRequirement = form.watch('prizes.coin_requirement');

  return (
    <section
      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border"
      aria-labelledby="contest-prizes-title"
    >
      <header className="border-border-subtle flex min-h-13 items-center border-b bg-[var(--bg-inset)] px-[18px] py-3">
        <h2 id="contest-prizes-title" className="text-heading text-sm font-extrabold">
          Money &amp; Coins
        </h2>
      </header>

      <div className="grid gap-[14px] p-[18px]">
        <FormSwitch name="prizes.isMoneyContest" label="Is money contest" />

        {isMoneyContest && (
          <div className="grid items-start gap-[14px] sm:grid-cols-3">
            <FormField
              control={form.control}
              name="prizes.minPrize"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={labelClass}>Min prize</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className={inputClass}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prizes.maxPrize"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={labelClass}>Max prize</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className={inputClass}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prizes.currency"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={labelClass}>Currency</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="USD"
                      maxLength={3}
                      className={inputClass}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage className="text-[9px]" />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormSwitch name="prizes.coin_requirement" label="Coin requirement" />

        {coinRequirement && (
          <FormField
            control={form.control}
            name="prizes.coin_required"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className={labelClass}>Required coins</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className={inputClass}
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage className="text-[9px]" />
              </FormItem>
            )}
          />
        )}
      </div>
    </section>
  );
};

export default PrizesStep;
