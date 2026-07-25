'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getDefaultContestValues } from '@/lib/contest';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { type FieldErrors, type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ContestEditorHeader from './ContestEditorHeader';
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
      <div className="mx-auto w-full max-w-[1380px]">
        <ContestEditorHeader mode={mode === 'create' ? 'create' : 'edit'} />
        <div className="grid items-start gap-[clamp(20px,2.4vw,36px)] min-[1280px]:grid-cols-[minmax(480px,1.08fr)_minmax(390px,0.92fr)]">
          <form
            className="grid min-w-0 gap-3"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast.error(findFirstError(errors) ?? 'Please check the highlighted fields.');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            })}
          >
            <DetailsStep />
            <PrizesStep />
            <RulesStep />
            <RewardsStep />

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="min-w-36"
                title={
                  mode === 'update' && !form.formState.isDirty ? 'No changes to save' : undefined
                }
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
          <div className="hidden min-[1280px]:block" aria-hidden="true" />
        </div>
      </div>
    </Form>
  );
};

export default ContestForm;
