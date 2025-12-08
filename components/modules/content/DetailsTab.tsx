'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { cn, formatDateToDayMonYear, formatDateWithTime } from '@/lib/utils';
import Image from 'next/image';
import { TipTapEditor } from '@/components/common/tiptap-editor';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { GoDotFill } from 'react-icons/go';

// Zod schema
const contestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  maxUpload: z.number().min(1, 'At least 1 upload allowed'),
  minPrize: z.number().min(0),
  maxPrize: z.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
});

type ContestFormValues = z.infer<typeof contestSchema>;

const DetailsTab = ({ contest }: { contest: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultValues: ContestFormValues = {
    title: contest.title || '',
    description: contest.description || '',
    maxUpload: contest.maxUploads || 1,
    minPrize: contest.minPrize || 0,
    maxPrize: contest.maxPrize || 0,
    startDate: new Date(contest.startDate),
    endDate: new Date(contest.endDate),
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContestFormValues>({
    resolver: zodResolver(contestSchema),
    defaultValues,
  });

  const onSubmit = (values: ContestFormValues) => {
    console.log('Updated Data:', values);
    setIsDialogOpen(false);
    // send updated data to backend
  };

  const {
    day: startDay,
    hours: startHours,
    minutes: startMinutes,
    month: startMonth,
    timeZone: startTimeZone,
    year: startYear,
  } = formatDateWithTime(contest.startDate);

  const {
    day: endDay,
    hours: endHours,
    minutes: endMinutes,
    month: endMonth,
    timeZone: endTimeZone,
    year: endYear,
  } = formatDateWithTime(contest.endDate);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Details
        </h1>

        <Button onClick={() => setIsDialogOpen(true)} className="text-white">
          <Pencil /> Edit
        </Button>
      </div>

      <div className="space-y-5 rounded-xl border p-5">
        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Creator</h1>
          <div className="flex items-center gap-2">
            <Image
              alt="Profile"
              src={contest?.creator?.avatar}
              width={40}
              height={40}
              className="size-10 min-w-10 overflow-hidden rounded-full bg-gray-900 object-cover"
            />
            <div className="">
              <h3 className="font-medium">{contest?.creator?.fullName}</h3>
              <p className="text-muted-foreground text-sm">{contest?.creator?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Title</h1>
          <h1 className="text-base font-semibold">{contest?.title}</h1>
        </div>

        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Description</h1>
          <TipTapViewer content={contest.description} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 text-sm">
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Money Contest</h1>
            <p className="text-base font-semibold">{contest?.isMoneyContest ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Vote</h1>
            <p className="text-base font-semibold">{contest?.totalVotes ?? 0}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Participant</h1>
            <p className="text-base font-semibold">N/A</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Status</h1>{' '}
            <button
              className={cn(
                'text-foreground flex cursor-default items-center justify-center gap-0.5 rounded-sm px-2 py-1.5 text-xs font-medium capitalize',
                contest?.status === 'ACTIVE' && 'bg-green-500/20 text-green-600',
                contest?.status === 'CLOSED' && 'bg-red-500/20 text-red-600',
                contest?.status === 'UPCOMING' && 'bg-yellow-500/20 text-yellow-600',
              )}
            >
              <GoDotFill /> {contest?.status}
            </button>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Mode</h1>
            <p className="text-base font-semibold">{contest?.mode}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Max Upload</h1>
            <p className="text-base font-semibold">{contest.maxUploads}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Min Prize</h1>
            <p className="text-base font-semibold">${contest.minPrize ?? 0}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Max Prize</h1>
            <p className="text-base font-semibold">${contest.maxPrize ?? 0}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Start Date</h1>
            <p className="text-base font-semibold">
              {startDay} {startMonth} {startYear}, {startHours}:{startMinutes}{' '}
              <span className="text-muted-foreground text-xs font-medium">{startTimeZone}</span>
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">End Date</h1>
            <p className="text-base font-semibold">
              {endDay} {endMonth} {endYear}, {endHours}:{endMinutes}{' '}
              <span className="text-muted-foreground text-xs font-medium">{endTimeZone}</span>
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Updated At</h1>
            <p className="text-base font-semibold">{formatDateToDayMonYear(contest.updatedAt)}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Created At</h1>
            <p className="text-base font-semibold">{formatDateToDayMonYear(contest.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 p-0 sm:max-h-[80vh] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="px-5 pt-5">Edit Details</DialogTitle>
          </DialogHeader>
          <form className="size-full overflow-y-auto p-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input {...register('title')} />
              {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Label>Description</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TipTapEditor
                    value={field.value}
                    onChange={field.onChange} // react-hook-form e sync korbe
                  />
                )}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5">
              {/* Numbers */}
              {['maxUpload', 'minPrize', 'maxPrize'].map((key) => (
                <div key={key} className="mt-3 flex flex-col gap-2">
                  <Label>{key}</Label>
                  <Input
                    type="number"
                    {...register(key as keyof ContestFormValues, { valueAsNumber: true })}
                  />
                  {errors[key as keyof ContestFormValues] && (
                    <span className="text-sm text-red-500">
                      {errors[key as keyof ContestFormValues]?.message as string}
                    </span>
                  )}
                </div>
              ))}

              {/* Start Date */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>Start Date & Time</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between">
                          {format(field.value, 'PPP p')}
                          <CalendarIcon className="ml-2 size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              {/* End Date */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>End Date & Time</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between">
                          {format(field.value, 'PPP p')}
                          <CalendarIcon className="ml-2 size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex shrink justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsTab;
