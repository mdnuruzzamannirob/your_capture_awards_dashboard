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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { buildUpdateRecurringIntervalBody, getApiErrorMessage } from '@/lib/recurringContest';
import { recurringIntervalSchema, type RecurringIntervalValues } from '@/lib/schemas/recurringContestSchema';
import { dateToZonedInput, zonedInputToDate } from '@/lib/timezone';
import { useUpdateRecurringIntervalMutation } from '@/store/features/recurringContest/recurringContestApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type EditRecurringIntervalDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: RecurringIntervalValues;
};

const EditRecurringIntervalDialog = ({
  id,
  open,
  onOpenChange,
  initialValues,
}: EditRecurringIntervalDialogProps) => {
  const [updateInterval, { isLoading }] = useUpdateRecurringIntervalMutation();
  const form = useForm<RecurringIntervalValues>({
    resolver: zodResolver(recurringIntervalSchema) as Resolver<RecurringIntervalValues>,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) form.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const timezone = form.watch('timezone') || 'UTC';

  const onSubmit = async (values: RecurringIntervalValues) => {
    try {
      await updateInterval({ id, body: buildUpdateRecurringIntervalBody(values) }).unwrap();
      toast.success('Recurrence schedule updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit recurrence schedule</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="recurringType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="UTC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxOccurrences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max occurrences (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Unlimited"
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === '' ? undefined : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence ends at (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="scheme-dark"
                      value={dateToZonedInput(field.value, timezone)}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value ? zonedInputToDate(event.target.value, timezone) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  'Save schedule'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecurringIntervalDialog;
