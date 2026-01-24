'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CREATE_CONTEST_RULE_ICONS } from '@/lib/constants';
import DynamicIcon from '@/components/common/DynamicIcon';

const RulesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const { fields, append, remove } = useFieldArray({ name: 'rules', control: form.control });

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h2 className="text-lg font-semibold">Rules ({fields.length})</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', icon: 'Info', description: '' })}
          className="gap-2 border-dashed"
        >
          <Plus className="size-4" /> Add Rule
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Rule {index + 1}</h3>
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

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name={`rules.${index}.icon`}
                render={({ field }) => {
                  const selectedOpt = CREATE_CONTEST_RULE_ICONS.find((o) => o.icon === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            const namePath = `rules.${index}.name` as const;
                            const currentName = form.getValues(namePath);
                            if (!currentName) {
                              const opt = CREATE_CONTEST_RULE_ICONS.find((o) => o.icon === val);
                              if (opt?.label) {
                                form.setValue(namePath, opt.label, { shouldValidate: true });
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="h-11! w-full">
                            <SelectValue placeholder="Pick an icon">
                              {selectedOpt && (
                                <span className="flex items-center gap-2">
                                  <DynamicIcon name={selectedOpt.icon} className="size-4" />
                                  {selectedOpt.label}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {CREATE_CONTEST_RULE_ICONS.map((opt) => (
                              <SelectItem key={opt.icon} value={opt.icon}>
                                <span className="flex items-center gap-2">
                                  <DynamicIcon name={opt.icon} className="size-4" />
                                  {opt.label}
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

              <FormField
                control={form.control}
                name={`rules.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rule title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`rules.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Describe the rule" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {form.formState.errors.rules && (
          <p className="text-sm text-red-400">{(form.formState.errors.rules as any).message}</p>
        )}
      </div>
    </div>
  );
};

export default RulesStep;
