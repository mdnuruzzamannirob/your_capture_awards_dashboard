'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ContestDetailsSkeleton from '@/components/modules/content/ContestDetailsSkeleton';
import DetailsTab from '@/components/modules/content/DetailsTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
import { CONTEST_DETAILS_TABS } from '@/lib/constants';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useGetContestQuery, useUpdateContestMutation } from '@/store/features/contest/contestApi';
import { toast } from 'sonner';

const ContestDetails = () => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'prizes' | 'rules' | 'rank' | 'winners'>(
    'details',
  );
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetContestQuery({ id: params?.id as string });
  const contest = data?.data ?? {};
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
        endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
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

  const isUpcoming = contest?.status === 'UPCOMING';
  const activeIndex = CONTEST_DETAILS_TABS.findIndex((t) => t.key === activeTab);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!contest?.id) return;

    form.reset({
      details: {
        title: contest.title ?? '',
        description: contest.description ?? '',
        banner: undefined as unknown as File,
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
      rewards: contest.prizes ?? [],
    });
  }, [contest, form]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (!currentTab) return;
    const { offsetWidth, offsetLeft } = currentTab;

    setIndicatorStyle({
      width: offsetWidth,
      left: offsetLeft,
    });
  }, [activeIndex, isLoading]);

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const parsed = contestFinalSchema.parse(form.getValues());
    const formData = new FormData();

    formData.append('title', parsed.details.title);
    formData.append('description', parsed.details.description);
    formData.append('recurring', String(parsed.details.recurring));
    if (parsed.details.recurringType) formData.append('recurringType', parsed.details.recurringType);
    formData.append('startDate', parsed.details.startDate.toISOString());
    formData.append('endDate', parsed.details.endDate.toISOString());
    formData.append('maxUploads', String(parsed.details.maxUploads));

    formData.append('isMoneyContest', String(parsed.prizes.isMoneyContest));
    formData.append('minPrize', String(parsed.prizes.minPrize));
    formData.append('maxPrize', String(parsed.prizes.maxPrize));
    formData.append('coin_requirement', String(parsed.prizes.coin_requirement));
    formData.append('coin_required', String(parsed.prizes.coin_required));

    try {
      await updateContest({ id: params?.id as string, body: formData }).unwrap();
      toast.success('Contest updated');
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Update failed');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab contest={contest} canEdit={isUpcoming} />;
      case 'prizes':
        return <PrizesTab contest={contest} />;
      case 'rules':
        return <RulesTab contest={contest} />;
      case 'rank':
        return <RankTab contest={contest} />;
      case 'winners':
        return <WinnerTab contest={contest} />;
      default:
        return null;
    }
  };

  if (isLoading || isFetching) {
    return <ContestDetailsSkeleton tabs={CONTEST_DETAILS_TABS} />;
  }

  if (!contest?.banner) {
    return <div className="text-muted-foreground p-5 text-sm">Contest not found.</div>;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section>
      <div className="h-96 w-full">
        <Image
          alt="banner"
          src={contest.banner}
          width={1920}
          height={500}
          className="size-full bg-gray-900 object-cover"
        />
      </div>

      <div className="relative flex overflow-x-auto border-b">
        {CONTEST_DETAILS_TABS.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative z-10 px-5 py-3 text-sm whitespace-nowrap transition',
              activeTab === tab.key
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:bg-gray-800',
            )}
          >
            {tab.label}
          </button>
        ))}

        <span
          className="bg-primary absolute bottom-0 h-0.5 transition-all duration-300"
          style={{
            width: indicatorStyle.width,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />

      </div>

      <div className="w-full p-5">{renderTabContent()}</div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Contest</DialogTitle>
          </DialogHeader>

          <FormProvider {...form}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input {...form.register('details.title')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input {...form.register('details.description')} />
              </div>
              <div className="space-y-2">
                <Label>Min Prize</Label>
                <Input type="number" {...form.register('prizes.minPrize', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Max Prize</Label>
                <Input type="number" {...form.register('prizes.maxPrize', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Max Uploads</Label>
                <Input type="number" {...form.register('details.maxUploads', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Required Coins</Label>
                <Input type="number" {...form.register('prizes.coin_required', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={isUpdating} onClick={() => void handleSave()}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContestDetails;
