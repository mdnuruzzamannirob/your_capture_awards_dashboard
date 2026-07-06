'use client';

import { useFormContext } from 'react-hook-form';
import { Coins } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';

const PrizesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const watchIsMoney = form.watch('prizes.isMoneyContest');
  const watchCoinRequirement = form.watch('prizes.coin_requirement');

  return (
    <div className="border-border bg-surface space-y-5 rounded-xl border p-5">
      <h2 className="border-border flex items-center gap-2 border-b pb-4 text-lg font-semibold">
        <Coins className="text-primary size-5" /> Money &amp; Coins
      </h2>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="prizes.isMoneyContest"
          render={({ field }) => (
            <FormItem className="border-border flex items-center gap-2 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="mt-0!">Is money contest</FormLabel>
                <p className="text-muted-foreground text-xs">
                  Enable this when the contest uses money.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchIsMoney && (
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="prizes.minPrize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min prize</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter minimum prize"
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      onBlur={() => form.trigger('prizes.minPrize')}
                    />
                  </FormControl>
                  {/* Reserve space so layout doesn't jump */}
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prizes.maxPrize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max prize</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter maximum prize"
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      onBlur={() => form.trigger('prizes.maxPrize')}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="prizes.coin_requirement"
          render={({ field }) => (
            <FormItem className="border-border flex items-center gap-2 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="mt-0!">Coin requirement</FormLabel>
                <p className="text-muted-foreground text-xs">
                  Show coin input only if this is enabled.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchCoinRequirement && (
          <FormField
            control={form.control}
            name="prizes.coin_required"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required coins</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Enter required coins"
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    onBlur={() => form.trigger('prizes.coin_required')}
                  />
                </FormControl>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PrizesStep;
