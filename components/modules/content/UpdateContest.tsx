'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CREATE_CONTEST_STEPS } from '@/lib/constants';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useGetContestQuery, useUpdateContestMutation } from '@/store/features/contest/contestApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DetailsStep from './DetailsStep';
import PrizesStep from './PrizesStep';
import ReviewStep from './ReviewStep';
import RewardsStep from './RewardsStep';
import RulesStep from './RulesStep';

const UpdateContest: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.id as string;

  const [currentStep, setCurrentStep] = useState<number>(0);

  const {
    data: contestData,
    isLoading: isFetching,
    isError,
  } = useGetContestQuery({ id: contestId }, { skip: !contestId });
  const contest = contestData?.data ?? {};
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();

  const form = useForm<ContestFinalValues>({
    resolver: zodResolver(contestFinalSchema) as Resolver<ContestFinalValues>,
    defaultValues: {
      details: {
        title: '',
        description: '',
        banner: undefined as unknown as File,
        maxUploads: 4,
        recurring: false,
        recurringType: 'MONTHLY',
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      prizes: {
        isMoneyContest: false,
        minPrize: 0,
        maxPrize: 0,
        coin_requirement: false,
        coin_required: 0,
      },
      rules: [],
      rewards: [],
    },
    mode: 'onChange',
  });

  const { watch, setValue, getValues, reset } = form;
  const { isDirty } = form.formState;
  const watchRecurring = watch('details.recurring');

  // Populate data on load
  useEffect(() => {
    if (!contest?.id) return;

    reset({
      details: {
        title: contest.title ?? '',
        description: contest.description ?? '',
        banner: contest.banner ?? '',
        maxUploads: contest.maxUploads ?? 4,
        recurring: Boolean(contest.recurring),
        recurringType: contest.recurringType ?? 'MONTHLY',
        startDate: contest.startDate ? new Date(contest.startDate) : new Date(),
        endDate: contest.endDate ? new Date(contest.endDate) : new Date(),
      },
      prizes: {
        isMoneyContest: Boolean(contest.isMoneyContest),
        minPrize: contest.minPrize ?? 0,
        maxPrize: contest.maxPrize ?? 0,
        coin_requirement: Boolean(contest.coin_requirement),
        coin_required: contest.coin_required ?? 0,
      },
      rules: contest.rules ?? [],
      rewards: (contest.prizes ?? []).map((p: any) => ({
        category: p.category,
        icon: p.icon || (p.category === 'TOP_PHOTO' ? 'Image' : 'User'),
        key: p.key ?? 0,
        boost: p.boost ?? 0,
        swap: p.swap ?? 0,
      })),
    });
  }, [contest, reset]);

  // Restore recurringType side-effect only (not prize reset which causes data loss)
  useEffect(() => {
    if (!watchRecurring) {
      if (getValues('details.recurringType') !== undefined) {
        setValue('details.recurringType', undefined);
      }
    } else {
      const val = getValues('details.recurringType');
      if (!val) setValue('details.recurringType', 'DAILY');
    }
  }, [watchRecurring, getValues, setValue]);

  const goToStep = async (targetIndex: number) => {
    if (targetIndex === currentStep) return;
    if (targetIndex < currentStep) {
      setCurrentStep(targetIndex);
      window.scrollTo(0, 0);
      return;
    }

    const isMoney = getValues('prizes.isMoneyContest');
    const hasCoinReq = getValues('prizes.coin_requirement');

    const fieldsByStep: Record<number, string[]> = {
      0: [
        'details.title',
        'details.description',
        'details.banner',
        'details.maxUploads',
        'details.recurring',
        'details.recurringType',
        'details.startDate',
        'details.endDate',
      ],
      1: [
        'prizes.isMoneyContest',
        ...(isMoney ? ['prizes.minPrize', 'prizes.maxPrize'] : []),
        'prizes.coin_requirement',
        ...(hasCoinReq ? ['prizes.coin_required'] : []),
      ],
      2: ['rules'],
      3: ['rewards'],
      4: [],
    };

    const fieldsToValidate = fieldsByStep[currentStep] || [];

    if (currentStep === 2 && getValues('rules').length === 0) {
      form.setError('rules', { type: 'manual', message: 'Please add at least one rule.' });
      return;
    }
    if (currentStep === 3 && getValues('rewards').length === 0) {
      form.setError('rewards', { type: 'manual', message: 'Please add at least one reward.' });
      return;
    }

    const ok = await form.trigger(fieldsToValidate as any);
    if (ok) {
      setCurrentStep(targetIndex);
      window.scrollTo(0, 0);
    } else {
      const errors = form.formState.errors;
      const stepErrors: string[] = [];
      fieldsToValidate.forEach((field) => {
        const fieldError = field.split('.').reduce((obj, key) => obj?.[key], errors as any);
        if (fieldError) {
          if (fieldError.message) {
            stepErrors.push(`${fieldError.message}`);
          } else if (Array.isArray(fieldError)) {
            fieldError.forEach((item, index) => {
              if (item) {
                Object.keys(item).forEach((k) => {
                  if (item[k]?.message) {
                    stepErrors.push(`Reward ${index + 1} - ${item[k].message}`);
                  }
                });
              }
            });
          }
        }
      });
      if (stepErrors.length > 0) {
        toast.error('Validation failed: ' + stepErrors.join(', '));
      } else {
        toast.error('Validation failed. Please check your inputs.');
      }
    }
  };

  const handleNext = async () => {
    await goToStep(Math.min(currentStep + 1, CREATE_CONTEST_STEPS.length - 1));
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      window.scrollTo(0, 0);
      return;
    }

    const raw = getValues();
    const data = contestFinalSchema.parse(raw);
    const formData = new FormData();

    const { details, prizes, rules, rewards } = data;

    formData.append('title', details.title);
    formData.append('description', details.description);
    formData.append('recurring', String(details.recurring));
    if (details.recurringType) formData.append('recurringType', details.recurringType);
    formData.append('startDate', details.startDate.toISOString());
    formData.append('endDate', details.endDate.toISOString());
    formData.append('maxUploads', String(details.maxUploads));

    if (details.banner instanceof File) {
      formData.append('banner', details.banner);
    }

    formData.append('isMoneyContest', String(prizes.isMoneyContest));
    formData.append('minPrize', String(prizes.minPrize));
    formData.append('maxPrize', String(prizes.maxPrize));
    formData.append('coin_requirement', String(prizes.coin_requirement));
    formData.append('coin_required', String(prizes.coin_required));

    rules.forEach((rule, idx) => {
      formData.append(`rules[${idx}][name]`, rule.name);
      formData.append(`rules[${idx}][description]`, rule.description);
      formData.append(`rules[${idx}][icon]`, rule.icon);
    });

    rewards.forEach((reward, idx) => {
      formData.append(`prizes[${idx}][category]`, reward.category);
      formData.append(`prizes[${idx}][boost]`, String(reward.boost));
      formData.append(`prizes[${idx}][key]`, String(reward.key));
      formData.append(`prizes[${idx}][swap]`, String(reward.swap));
      if (reward.icon) formData.append(`prizes[${idx}][icon]`, reward.icon);
    });

    try {
      await updateContest({ id: contestId, body: formData }).unwrap();
      toast.success('Contest updated successfully');
      router.push(`/contest/${contestId}`);
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || 'Something went wrong!');
    }
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return <DetailsStep />;
      case 1:
        return <PrizesStep />;
      case 2:
        return <RulesStep />;
      case 3:
        return <RewardsStep />;
      case 4:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  if (isError || !contest?.id) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted-foreground">
        <p>Contest not found or error loading data.</p>
        <Button onClick={() => router.push('/contest')} className="mt-4">
          Back to Contests
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <aside className="scrollbar-thin sticky top-[77px] z-30 col-span-12 flex h-fit w-full flex-row items-start gap-10 overflow-x-auto rounded-xl border border-border bg-surface p-5 max-xl:justify-between xl:col-span-2 xl:flex-col">
            {CREATE_CONTEST_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => void goToStep(index)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-tertiary"
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold"
                    style={{
                      borderColor: isActive
                        ? 'var(--color-success-500)'
                        : isCompleted
                          ? 'var(--color-zinc-400)'
                          : 'var(--color-zinc-600)',
                      color: isActive ? 'var(--color-success-500)' : 'var(--foreground)',
                    }}
                  >
                    {isCompleted ? <CheckCircle className="size-4 min-w-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">Step {index + 1} of 5</p>
                  </div>
                </button>
              );
            })}
          </aside>

          <div className="col-span-12 space-y-6 xl:col-span-10">
            {stepContent()}

            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : 'visible'}
              >
                <ArrowLeft className="size-4" /> Back
              </Button>

              {currentStep === CREATE_CONTEST_STEPS.length - 1 ? (
                <Button
                  type="button"
                  disabled={isUpdating || !isDirty}
                  onClick={handleFinalSubmit}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  title={!isDirty ? 'No changes to save' : undefined}
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext} className="gap-2">
                  Next Step <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UpdateContest;
