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
import ContestEditorHeader, { type ContestEditorHeaderCopy } from './ContestEditorHeader';
import DetailsStep from './DetailsStep';
import PotyEntryFeeStep from './PotyEntryFeeStep';
import PrizesStep from './PrizesStep';
import RewardsStep from './RewardsStep';
import RulesStep from './RulesStep';

interface ContestFormProps {
  mode: 'create' | 'update';
  initialValues?: ContestFinalValues;
  isSubmitting: boolean;
  onSubmit: (values: ContestFinalValues) => Promise<void>;
  onCancel?: () => void;
  /**
   * The contest is already running (Photographer of the Year can be edited while
   * active). Start date, entry fee and rules are shown read-only because people
   * have already joined under them.
   */
  lockStartedFields?: boolean;
  /**
   * Entry fee and rules only. Photographer of the Year takes registrations
   * while scheduled, so these lock as soon as anyone has registered, even
   * though the start date can still move. Defaults to lockStartedFields.
   */
  lockFeeAndRules?: boolean;
  /** Overrides the page header's back link, title and description. */
  header?: ContestEditorHeaderCopy;
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
  lockStartedFields = false,
  lockFeeAndRules,
  header,
}: ContestFormProps) => {
  const form = useForm<ContestFinalValues>({
    resolver: zodResolver(contestFinalSchema) as Resolver<ContestFinalValues>,
    defaultValues: initialValues ?? getDefaultContestValues(),
    mode: 'onChange',
  });

  const recurring = form.watch('details.recurring');
  const isPhotographyOfYear = form.watch('details.isPhotographyOfYear');
  const isMoneyContest = form.watch('prizes.isMoneyContest');
  const coinRequirement = form.watch('prizes.coin_requirement');
  const feeAndRulesLocked = lockFeeAndRules ?? lockStartedFields;
  const lockReason = lockStartedFields ? 'the contest has started' : 'people have registered';

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
      <div className="mx-auto w-full max-w-345">
        <ContestEditorHeader mode={mode === 'create' ? 'create' : 'edit'} {...header} />
        <div className="grid items-start gap-[clamp(20px,2.4vw,36px)] min-[1280px]:grid-cols-[minmax(480px,1.08fr)_minmax(390px,0.92fr)]">
          <form
            className="grid min-w-0 gap-3"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              toast.error(findFirstError(errors) ?? 'Please check the highlighted fields.');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            })}
          >
            {lockStartedFields ? (
              <div className="border-warning/30 bg-warning/10 text-warning rounded-lg border px-4 py-3 text-xs leading-5">
                This contest is already running. You can change the title, description, categories,
                banner and end date. The start date, entry fee and rules are locked because
                participants have already joined under them.
              </div>
            ) : feeAndRulesLocked ? (
              <div className="border-warning/30 bg-warning/10 text-warning rounded-lg border px-4 py-3 text-xs leading-5">
                People have already registered for this contest. You can still change the dates,
                title, description, categories and banner. The entry fee and rules are locked
                because participants registered under them.
              </div>
            ) : null}
            <DetailsStep startDateLocked={lockStartedFields} />
            {/* A disabled fieldset disables every input and checkbox button inside it. */}
            <fieldset
              disabled={feeAndRulesLocked}
              className={feeAndRulesLocked ? 'pointer-events-none min-w-0 opacity-60' : 'min-w-0'}
            >
              <RulesStep locked={feeAndRulesLocked} lockedReason={lockReason} />
            </fieldset>
            {isPhotographyOfYear ? (
              <PotyEntryFeeStep locked={feeAndRulesLocked} lockedReason={lockReason} />
            ) : (
              <>
                <PrizesStep />
                <RewardsStep />
              </>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 pt-1">
              {onCancel ? (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              ) : null}
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
