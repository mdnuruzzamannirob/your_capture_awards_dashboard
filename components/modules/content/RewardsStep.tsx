'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Gift, Trash2, Plus } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CREATE_CONTEST_PRIZE_TYPES } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import DynamicIcon from '@/components/common/DynamicIcon';

const RewardsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const { fields, append, remove } = useFieldArray({ name: 'rewards', control: form.control });

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Gift className="size-5 text-amber-500" /> Rewards ({fields.length})
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ category: 'TOP_PHOTOGRAPHER', icon: 'User', key: 0, boost: 0, swap: 0 })
          }
          className="gap-2 border-dashed"
        >
          <Plus className="size-4" /> Add Reward
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 space-y-4 md:grid-cols-2">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Reward {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`rewards.${index}.category`}
              render={({ field }) => {
                const selectedType = CREATE_CONTEST_PRIZE_TYPES.find(
                  (t) => t.value === field.value,
                );
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          const type = CREATE_CONTEST_PRIZE_TYPES.find((t) => t.value === val);
                          if (type?.icon) {
                            form.setValue(`rewards.${index}.icon` as const, type.icon, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="h-11! w-full">
                          <SelectValue placeholder="Select category">
                            {selectedType && (
                              <span className="flex items-center gap-2">
                                <DynamicIcon name={selectedType.icon} className="size-4" />
                                {selectedType.label}
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {CREATE_CONTEST_PRIZE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <span className="flex items-center gap-2">
                                <DynamicIcon name={type.icon} className="size-4" />
                                {type.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid gap-3 md:grid-cols-3">
              <FormField
                control={form.control}
                name={`rewards.${index}.key`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keys</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
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
                name={`rewards.${index}.boost`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
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
                name={`rewards.${index}.swap`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swap</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
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
          </div>
        ))}

        {form.formState.errors.rewards && (
          <p className="text-sm text-red-400">{(form.formState.errors.rewards as any).message}</p>
        )}
      </div>
    </div>
  );
};

export default RewardsStep;
