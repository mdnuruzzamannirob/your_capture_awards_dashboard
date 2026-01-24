'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';

const PrizesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const watchType = form.watch('prizes.type');
  const watchIsMoney = form.watch('prizes.isMoneyContest');

  useEffect(() => {
    if (watchType === 'OPEN' && watchIsMoney) {
      form.setValue('prizes.isMoneyContest', false);
    }
    if ((watchType === 'PRO' || watchType === 'PREMIUM') && !watchIsMoney) {
      form.setValue('prizes.isMoneyContest', true);
    }
  }, [watchType, watchIsMoney, form]);

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="flex items-center gap-2 border-b border-gray-700 pb-4 text-lg font-semibold">
        <DollarSign className="size-5 text-amber-400" /> Prizes
      </h2>

      <div className="grid grid-cols-1 items-start gap-4 space-y-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="prizes.type"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Contest type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11! w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="PRO">Pro</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="col-span-full rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-100">
          {watchType === 'OPEN'
            ? 'Open contests cannot offer money prizes; min/max prize disabled.'
            : 'Money contest enabled; set the min and max prize amounts.'}
        </div> */}

        <div className="col-span-full grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="prizes.minPrize"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Min prize (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    disabled={!watchIsMoney}
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
              <FormItem className="col-span-1">
                <FormLabel>Max prize (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    disabled={!watchIsMoney}
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

        {/* <div className="flex items-center gap-2 text-sm text-gray-400">
          <Award className="size-4 text-emerald-400" />
          isMoneyContest is derived from type (OPEN = false, PRO/PREMIUM = true).
        </div> */}
      </div>
    </div>
  );
};

export default PrizesStep;
