'use client';

import ContestDetailsSkeleton from '@/components/modules/content/ContestDetailsSkeleton';
import DetailsTab from '@/components/modules/content/DetailsTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CONTEST_DETAILS_TABS } from '@/lib/constants';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import { cn } from '@/lib/utils';
import { useGetContestQuery, useUpdateContestMutation } from '@/store/features/contest/contestApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
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
  const bannerPreview = form.watch('details.banner');
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>('');

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
    setBannerPreviewUrl('');
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

  useEffect(() => {
    if (bannerPreview instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(bannerPreview);
    }
  }, [bannerPreview]);

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const parsed = contestFinalSchema.parse(form.getValues());
    const formData = new FormData();

    formData.append('title', parsed.details.title);
    formData.append('description', parsed.details.description);
    formData.append('recurring', String(parsed.details.recurring));
    if (parsed.details.recurringType)
      formData.append('recurringType', parsed.details.recurringType);
    formData.append('startDate', parsed.details.startDate.toISOString());
    formData.append('endDate', parsed.details.endDate.toISOString());
    formData.append('maxUploads', String(parsed.details.maxUploads));

    // Only append banner if a new one is selected
    if (parsed.details.banner instanceof File) {
      formData.append('banner', parsed.details.banner);
    }

    formData.append('isMoneyContest', String(parsed.prizes.isMoneyContest));
    formData.append('minPrize', String(parsed.prizes.minPrize));
    formData.append('maxPrize', String(parsed.prizes.maxPrize));
    formData.append('coin_requirement', String(parsed.prizes.coin_requirement));
    formData.append('coin_required', String(parsed.prizes.coin_required));

    // Append rules
    parsed.rules.forEach((rule, idx) => {
      formData.append(`rules[${idx}][name]`, rule.name);
      formData.append(`rules[${idx}][description]`, rule.description);
      formData.append(`rules[${idx}][icon]`, rule.icon);
    });

    // Append rewards (prizes)
    parsed.rewards.forEach((reward, idx) => {
      formData.append(`prizes[${idx}][category]`, reward.category);
      formData.append(`prizes[${idx}][boost]`, String(reward.boost));
      formData.append(`prizes[${idx}][key]`, String(reward.key));
      formData.append(`prizes[${idx}][swap]`, String(reward.swap));
      if (reward.icon) formData.append(`prizes[${idx}][icon]`, reward.icon);
    });

    try {
      await updateContest({ id: params?.id as string, body: formData }).unwrap();
      toast.success('Contest updated successfully');
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Update failed');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            contest={contest}
            canEdit={isUpcoming}
            onEditClick={() => setIsEditOpen(true)}
          />
        );
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Contest</DialogTitle>
            {!isUpcoming && (
              <p className="text-muted-foreground mt-2 text-xs">
                Contest can only be edited when status is UPCOMING
              </p>
            )}
          </DialogHeader>

          <FormProvider {...form}>
            <div className="space-y-6">
              {/* Banner Upload */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="space-y-2">
                  {bannerPreviewUrl ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-lg border">
                      <Image
                        src={bannerPreviewUrl}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-950">
                      <p className="text-muted-foreground text-sm">No new banner selected</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    {...form.register('details.banner')}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Title</Label>
                  <Input {...form.register('details.title')} placeholder="Contest title" />
                  {form.formState.errors.details?.title && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.details.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    {...form.register('details.description')}
                    placeholder="Contest description"
                    className="min-h-24"
                  />
                  {form.formState.errors.details?.description && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.details.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Max Uploads</Label>
                  <Input
                    type="number"
                    {...form.register('details.maxUploads', { valueAsNumber: true })}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between" type="button">
                        {form.watch('details.startDate')
                          ? format(form.watch('details.startDate'), 'PPP')
                          : 'Pick a date'}
                        <CalendarIcon className="ml-2 size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch('details.startDate')}
                        onSelect={(date) => date && form.setValue('details.startDate', date)}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between" type="button">
                        {form.watch('details.endDate')
                          ? format(form.watch('details.endDate'), 'PPP')
                          : 'Pick a date'}
                        <CalendarIcon className="ml-2 size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch('details.endDate')}
                        onSelect={(date) => date && form.setValue('details.endDate', date)}
                        disabled={(date) => date < form.watch('details.startDate')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Prize Settings */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Prize Settings</h3>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isMoneyContest"
                    {...form.register('prizes.isMoneyContest')}
                    className="rounded border"
                  />
                  <Label htmlFor="isMoneyContest" className="cursor-pointer font-normal">
                    Is Money Contest
                  </Label>
                </div>

                {form.watch('prizes.isMoneyContest') && (
                  <div className="ml-6 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Min Prize</Label>
                      <Input
                        type="number"
                        {...form.register('prizes.minPrize', { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Prize</Label>
                      <Input
                        type="number"
                        {...form.register('prizes.maxPrize', { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="coinRequirement"
                    {...form.register('prizes.coin_requirement')}
                    className="rounded border"
                  />
                  <Label htmlFor="coinRequirement" className="cursor-pointer font-normal">
                    Coin Requirement
                  </Label>
                </div>

                {form.watch('prizes.coin_requirement') && (
                  <div className="ml-6 space-y-2">
                    <Label>Coins Required</Label>
                    <Input
                      type="number"
                      {...form.register('prizes.coin_required', { valueAsNumber: true })}
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Rules */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Rules</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const rules = form.getValues('rules') || [];
                      form.setValue('rules', [
                        ...rules,
                        { name: '', description: '', icon: 'Info' },
                      ]);
                    }}
                  >
                    Add Rule
                  </Button>
                </div>

                {form.watch('rules')?.map((rule, idx) => (
                  <div key={idx} className="grid gap-3 rounded-lg border p-3">
                    <Input placeholder="Rule name" {...form.register(`rules.${idx}.name`)} />
                    <Textarea
                      placeholder="Rule description"
                      {...form.register(`rules.${idx}.description`)}
                      className="min-h-20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const rules = form.getValues('rules');
                        form.setValue(
                          'rules',
                          rules.filter((_, i) => i !== idx),
                        );
                      }}
                    >
                      Remove Rule
                    </Button>
                  </div>
                ))}
              </div>

              {/* Rewards */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Rewards</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const rewards = form.getValues('rewards') || [];
                      form.setValue('rewards', [
                        ...rewards,
                        {
                          category: 'TOP_PHOTOGRAPHER',
                          icon: 'Trophy',
                          key: 0,
                          boost: 0,
                          swap: 0,
                        },
                      ]);
                    }}
                  >
                    Add Reward
                  </Button>
                </div>

                {form.watch('rewards')?.map((reward, idx) => (
                  <div key={idx} className="grid gap-3 rounded-lg border p-3 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Category</Label>
                      <Input
                        placeholder="e.g., TOP_PHOTOGRAPHER"
                        {...form.register(`rewards.${idx}.category`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Boost</Label>
                      <Input
                        type="number"
                        {...form.register(`rewards.${idx}.boost`, { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Swap</Label>
                      <Input
                        type="number"
                        {...form.register(`rewards.${idx}.swap`, { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        type="number"
                        {...form.register(`rewards.${idx}.key`, { valueAsNumber: true })}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input placeholder="Icon name" {...form.register(`rewards.${idx}.icon`)} />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const rewards = form.getValues('rewards');
                        form.setValue(
                          'rewards',
                          rewards.filter((_, i) => i !== idx),
                        );
                      }}
                    >
                      Remove Reward
                    </Button>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t pt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" disabled={isUpdating} onClick={() => void handleSave()}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContestDetails;
