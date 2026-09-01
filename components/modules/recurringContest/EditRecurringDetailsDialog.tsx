'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { buildUpdateRecurringContestBody, getApiErrorMessage } from '@/lib/recurringContest';
import { recurringDetailsSchema, type RecurringDetailsValues } from '@/lib/schemas/recurringContestSchema';
import { dateToZonedInput, zonedInputToDate } from '@/lib/timezone';
import { useUpdateRecurringContestMutation } from '@/store/features/recurringContest/recurringContestApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type EditRecurringDetailsDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: RecurringDetailsValues;
  timezone: string;
};

const EditRecurringDetailsDialog = ({
  id,
  open,
  onOpenChange,
  initialValues,
  timezone,
}: EditRecurringDetailsDialogProps) => {
  const [updateRecurringContest, { isLoading }] = useUpdateRecurringContestMutation();
  const form = useForm<RecurringDetailsValues>({
    resolver: zodResolver(recurringDetailsSchema) as Resolver<RecurringDetailsValues>,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) form.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isMoneyContest = form.watch('isMoneyContest');

  const onSubmit = async (values: RecurringDetailsValues) => {
    try {
      await updateRecurringContest({ id, body: buildUpdateRecurringContestBody(values) }).unwrap();
      toast.success('Recurring contest details updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-56px)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit recurring contest details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date &amp; time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="scheme-dark"
                        value={dateToZonedInput(field.value, timezone)}
                        onChange={(event) => field.onChange(zonedInputToDate(event.target.value, timezone))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date &amp; time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="scheme-dark"
                        value={dateToZonedInput(field.value, timezone)}
                        onChange={(event) => field.onChange(zonedInputToDate(event.target.value, timezone))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entryFeeCoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry fee (coins)</FormLabel>
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

            <FormField
              control={form.control}
              name="isMoneyContest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5 space-y-0">
                  <FormLabel className="mt-0!">Money contest</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMoneyContest && (
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="minPrize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min prize</FormLabel>
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
                <FormField
                  control={form.control}
                  name="maxPrize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max prize</FormLabel>
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
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="USD" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecurringDetailsDialog;
