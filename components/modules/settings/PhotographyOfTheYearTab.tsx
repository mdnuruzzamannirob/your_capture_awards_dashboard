'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import DetailsStep from '@/components/modules/content/DetailsStep';
import PrizesStep from '@/components/modules/content/PrizesStep';
import RewardsStep from '@/components/modules/content/RewardsStep';
import RulesStep from '@/components/modules/content/RulesStep';
import { getDefaultContestValues } from '@/lib/contest';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { type FieldErrors, type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

const PhotographyOfTheYearTab = () => {
  const form = useForm<ContestFinalValues>({
    resolver: zodResolver(contestFinalSchema) as Resolver<ContestFinalValues>,
    defaultValues: getDefaultContestValues(),
    mode: 'onChange',
  });

  const recurring = form.watch('details.recurring');
  const isMoneyContest = form.watch('prizes.isMoneyContest');
  const coinRequirement = form.watch('prizes.coin_requirement');

  // Same field-sync rules the contest editor uses, so the dependent inputs
  // enable/clear exactly the way they do on the create contest page.
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

  // Design-only for now: no mutation is wired up yet, so submitting just
  // confirms the form validates. Replace this with the real API call later.
  const handleSubmit = () => {
    toast.info('Design preview only - saving is not wired up yet.');
  };

  return (
    <div className="animate-fade-in w-full">
      <header className="mb-7 w-full pb-5">
        <h2 className="text-heading mt-0 mb-1.5 flex items-center gap-2 text-[clamp(1.5rem,2.5vw,2rem)] leading-tight font-semibold tracking-[-0.035em]">
          <Trophy className="text-primary size-6" />
          Photography of the Year
        </h2>
        <p className="text-muted-foreground max-w-[570px] text-[13px] leading-[1.5]">
          Configure the yearly showcase with clear rules and awards.
        </p>
      </header>

      <Form {...form}>
        <div className="grid items-start gap-[clamp(20px,2.4vw,36px)] min-[1280px]:grid-cols-[minmax(480px,1.08fr)_minmax(390px,0.92fr)]">
          <form
            className="grid min-w-0 gap-3"
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              toast.error(findFirstError(errors) ?? 'Please check the highlighted fields.');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            })}
          >
            <DetailsStep />
            <PrizesStep />
            <RulesStep />
            <RewardsStep />

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(getDefaultContestValues())}
              >
                Reset
              </Button>
              <Button type="submit" className="min-w-36">
                Save Photography of the Year
              </Button>
            </div>
          </form>
          <div className="hidden min-[1280px]:block" aria-hidden="true" />
        </div>
      </Form>
    </div>
  );
};

export default PhotographyOfTheYearTab;
