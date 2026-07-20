'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getDefaultContestValues } from '@/lib/contest';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { type FieldErrors, type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DetailsStep from './DetailsStep';
import PrizesStep from './PrizesStep';
import RewardsStep from './RewardsStep';
import RulesStep from './RulesStep';

interface ContestFormProps {
  mode: 'create' | 'update';
  initialValues?: ContestFinalValues;
  isSubmitting: boolean;
  onSubmit: (values: ContestFinalValues) => Promise<void>;
  onCancel: () => void;
}

function findFirstError(errors: FieldErrors<ContestFinalValues>): string | undefined {
  const queue: unknown[] = [errors];
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if ('message' in current && typeof current.message === 'string') return current.message;
    queue.push(...Object.values(current));
  }
  return undefined;
}

const ContestForm = ({
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ContestFormProps) => {
  const form = useForm<ContestFinalValues>({
    resolver: zodResolver(contestFinalSchema) as Resolver<ContestFinalValues>,
    defaultValues: initialValues ?? getDefaultContestValues(),
    mode: 'onChange',
  });

  const recurring = form.watch('details.recurring');
  const isMoneyContest = form.watch('prizes.isMoneyContest');
  const coinRequirement = form.watch('prizes.coin_requirement');

  useEffect(() => {
    const current = form.getValues('details.recurringType');
    if (!recurring && current !== undefined) {
      form.setValue('details.recurringType', undefined, { shouldDirty: true });
    } else if (recurring && !current) {
      form.setValue('details.recurringType', 'DAILY', { shouldDirty: true });
    }
  }, [form, recurring]);

  useEffect(() => {
    if (isMoneyContest) return;
    if (form.getValues('prizes.minPrize') !== 0) {
      form.setValue('prizes.minPrize', 0, { shouldDirty: true });
    }
    if (form.getValues('prizes.maxPrize') !== 0) {
      form.setValue('prizes.maxPrize', 0, { shouldDirty: true });
    }
  }, [form, isMoneyContest]);

  useEffect(() => {
    if (!coinRequirement && form.getValues('prizes.coin_required') !== 0) {
      form.setValue('prizes.coin_required', 0, { shouldDirty: true });
    }
  }, [coinRequirement, form]);

  const submitLabel = mode === 'create' ? 'Create Contest' : 'Save Changes';
  const isSubmitDisabled = isSubmitting || (mode === 'update' && !form.formState.isDirty);

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-5xl space-y-5"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast.error(findFirstError(errors) ?? 'Please check the highlighted fields.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })}
      >
        <DetailsStep />
        <PrizesStep />
        <RulesStep />
        <RewardsStep />

        <div className="border-border bg-surface sticky bottom-4 z-20 flex flex-wrap items-center justify-end gap-3 rounded-xl border p-4 shadow-xl">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="text-foreground min-w-36 gap-2"
            title={mode === 'update' && !form.formState.isDirty ? 'No changes to save' : undefined}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="size-4" /> {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContestForm;
