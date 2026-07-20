'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CONTEST_AWARD_OPTIONS } from '@/lib/constants';
import { getAwardLabel } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type { ContestAwardType } from '@/store/features/contest/types';
import { Award, Plus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const RewardsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const { fields, append, remove } = useFieldArray({ name: 'awards', control: form.control });
  const awards = form.watch('awards');
  const [selectedAward, setSelectedAward] = useState<ContestAwardType>('SUPREME');

  const availableOptions = useMemo(() => {
    const selected = new Set(awards.map((award) => award.type));
    return CONTEST_AWARD_OPTIONS.filter((option) => !selected.has(option.value));
  }, [awards]);

  useEffect(() => {
    if (
      availableOptions.length &&
      !availableOptions.some((option) => option.value === selectedAward)
    ) {
      setSelectedAward(availableOptions[0].value);
    }
  }, [availableOptions, selectedAward]);

  const addAward = () => {
    if (!availableOptions.some((option) => option.value === selectedAward)) return;
    append({ type: selectedAward, boost: 0, key: 0, swap: 0, coin: 0 });
    const next = availableOptions.find((option) => option.value !== selectedAward);
    if (next) setSelectedAward(next.value);
  };

  return (
    <div className="border-border bg-surface space-y-5 rounded-xl border p-5">
      <h2 className="border-border flex items-center gap-2 border-b pb-4 text-lg font-semibold">
        <Award className="text-primary size-5" /> Awards
      </h2>

      {availableOptions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Select
            value={selectedAward}
            onValueChange={(value) => setSelectedAward(value as ContestAwardType)}
          >
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Select an award" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <DynamicIcon name={option.icon} className="size-4" />
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={addAward} className="h-11 gap-2">
            <Plus className="size-4" /> Add award
          </Button>
        </div>
      )}

      <div className="grid items-start gap-4 md:grid-cols-2">
        {fields.map((award, index) => {
          const option = CONTEST_AWARD_OPTIONS.find((item) => item.value === award.type);
          return (
            <div key={award.id} className="border-border space-y-4 rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <DynamicIcon name={option?.icon ?? 'Award'} className="text-primary size-4" />
                  {option?.label ?? getAwardLabel(award.type)}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${getAwardLabel(award.type)}`}
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive size-8"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>

              <input type="hidden" {...form.register(`awards.${index}.type`)} />

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['boost', 'Boost'],
                    ['key', 'Key'],
                    ['swap', 'Swap'],
                    ['coin', 'Coin'],
                  ] as const
                ).map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`awards.${index}.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {form.formState.errors.awards?.root?.message && (
        <p className="text-destructive text-sm">{form.formState.errors.awards.root.message}</p>
      )}
      {typeof form.formState.errors.awards?.message === 'string' && (
        <p className="text-destructive text-sm">{form.formState.errors.awards.message}</p>
      )}
    </div>
  );
};

export default RewardsStep;
