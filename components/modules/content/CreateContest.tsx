'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { CREATE_CONTEST_STEPS } from '@/lib/constants';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useCreateContestMutation } from '@/store/features/contest/contestApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DetailsStep from './DetailsStep';
import PrizesStep from './PrizesStep';
import RulesStep from './RulesStep';
import RewardsStep from './RewardsStep';
import ReviewStep from './ReviewStep';

const CreateContest: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [createContest, { isLoading }] = useCreateContestMutation();

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
        type: 'OPEN',
        isMoneyContest: false,
        minPrize: 0,
        maxPrize: 0,
      },
      rules: [{ name: 'General Rule', description: 'General Rule', icon: 'Info' }],
      rewards: [
        {
          category: 'TOP_PHOTOGRAPHER',
          icon: 'User',
          key: 0,
          boost: 0,
          swap: 0,
        },
      ],
    },
    mode: 'onChange',
  });

  const { watch, setValue, getValues, trigger } = form;
  const watchRecurring = watch('details.recurring');
  const watchType = watch('prizes.type');
  const watchIsMoney = watch('prizes.isMoneyContest');

  useEffect(() => {
    if (!watchRecurring) {
      setValue('details.recurringType', undefined);
      void trigger('details.recurringType');
    } else {
      const val = getValues('details.recurringType');
      if (!val) setValue('details.recurringType', 'DAILY');
    }
  }, [watchRecurring, getValues, setValue, trigger]);

  useEffect(() => {
    if (watchType === 'OPEN' && watchIsMoney) {
      setValue('prizes.isMoneyContest', false);
    }
    if ((watchType === 'PRO' || watchType === 'PREMIUM') && !watchIsMoney) {
      setValue('prizes.isMoneyContest', true);
    }

    if (!watchIsMoney) {
      setValue('prizes.minPrize', 0);
      setValue('prizes.maxPrize', 0);
      void trigger(['prizes.minPrize', 'prizes.maxPrize']);
    }
  }, [watchType, watchIsMoney, setValue, trigger]);

  const goToStep = async (targetIndex: number) => {
    if (targetIndex === currentStep) return;
    if (targetIndex < currentStep) {
      setCurrentStep(targetIndex);
      window.scrollTo(0, 0);
      return;
    }

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
      1: ['prizes.type', 'prizes.isMoneyContest', 'prizes.minPrize', 'prizes.maxPrize'],
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
    if (details.banner) formData.append('banner', details.banner);

    formData.append('type', prizes.type);
    formData.append('isMoneyContest', String(prizes.isMoneyContest));
    formData.append('minPrize', String(prizes.minPrize));
    formData.append('maxPrize', String(prizes.maxPrize));

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
      formData.append(`prizes[${idx}][icon]`, reward.icon);
    });

    try {
      await createContest(formData).unwrap();
      toast.success('New Contest Created');
      router.push('/contest');
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

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <aside className="sticky top-[77px] z-30 col-span-12 flex h-fit w-full flex-row items-start gap-10 overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 p-5 max-xl:justify-between xl:col-span-2 xl:flex-col">
            {CREATE_CONTEST_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => void goToStep(index)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-800"
                >
                  <span
                    className={
                      'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold'
                    }
                    style={{
                      borderColor: isActive ? '#34d399' : isCompleted ? '#9ca3af' : '#4b5563',
                      color: isActive ? '#34d399' : '#e5e7eb',
                    }}
                  >
                    {isCompleted ? <CheckCircle className="size-4 min-w-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs text-gray-400">Step {index + 1} of 5</p>
                  </div>
                </button>
              );
            })}
          </aside>

          <div className="col-span-12 space-y-6 xl:col-span-10">
            {stepContent()}

            <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
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
                  disabled={isLoading}
                  onClick={handleFinalSubmit}
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isLoading ? 'Submitting...' : 'Create Contest'}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext} className="gap-2 text-white">
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

export default CreateContest;
