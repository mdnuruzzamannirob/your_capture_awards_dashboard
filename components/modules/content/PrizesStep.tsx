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
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="flex items-center gap-2 border-b border-gray-800 pb-4 text-lg font-semibold">
        <Coins className="size-5 text-amber-400" /> Money & Coins
      </h2>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="prizes.isMoneyContest"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-gray-800 p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="mt-0!">Is money contest</FormLabel>
                <p className="text-xs text-gray-400">Enable this when the contest uses money.</p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchIsMoney && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    />
                  </FormControl>
                  <FormMessage />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="prizes.coin_requirement"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border border-gray-800 p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="mt-0!">Coin requirement</FormLabel>
                <p className="text-xs text-gray-400">Show coin input only if this is enabled.</p>
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PrizesStep;
