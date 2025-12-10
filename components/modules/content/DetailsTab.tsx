'use client';

import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock, Info, Pencil } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { cn, formatDateToDayMonYear, formatDateWithTime } from '@/lib/utils';
import Image from 'next/image';
import { TipTapEditor } from '@/components/common/tiptap-editor';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { GoDotFill } from 'react-icons/go';
import { contestDetailsSchema, ContestDetailsValues } from '@/lib/schemas/contestSchema';
import { z } from 'zod';

type ContestStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED' | string;

const MAX_UPLOADS = 4;

// Single source of truth for editable fields per status
const EDITABLE_FIELDS_BY_STATUS: Record<
  Exclude<ContestStatus, string>,
  Partial<Record<keyof ContestDetailsValues, boolean>>
> = {
  UPCOMING: {
    title: true,
    description: true,
    maxUploads: true,
    isMoneyContest: true,
    minPrize: true,
    maxPrize: true,
    recurring: true,
    recurringType: true,
    startDate: true,
    endDate: true,
  },

  ACTIVE: {
    title: true,
    description: true,
    recurring: true,
    recurringType: true,
    endDate: true,
    // NOTE: startDate intentionally not editable in ACTIVE
  },

  CLOSED: {
    // nothing editable
  },
};

const DetailsTab = ({ contest }: { contest: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // default values for form
  const defaultValues: ContestDetailsValues = {
    title: contest.title ?? '',
    description: contest.description ?? '',
    maxUploads: contest.maxUploads ?? 1,
    isMoneyContest: contest.isMoneyContest ?? false,
    minPrize: contest.minPrize ?? 0,
    maxPrize: contest.maxPrize ?? 0,
    startDate: contest.startDate ? new Date(contest.startDate) : new Date(),
    endDate: contest.endDate ? new Date(contest.endDate) : new Date(),
    recurring: contest.recurring ?? false,
    recurringType: contest.recurringType ?? undefined,
  };

  const form = useForm<ContestDetailsValues>({
    resolver: zodResolver(contestDetailsSchema) as Resolver<ContestDetailsValues>,
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { isSubmitting },
  } = form;

  // keep form in sync if contest prop changes
  useEffect(() => {
    reset(defaultValues);
  }, [contest?.id]);

  const isMoneyContestWatch = watch('isMoneyContest');
  const recurringWatch = watch('recurring');

  const status = (contest?.status ?? 'UPCOMING') as ContestStatus;

  // helper to check editable map
  const canEditField = (field: keyof ContestDetailsValues) => {
    const map = EDITABLE_FIELDS_BY_STATUS[status as Exclude<ContestStatus, string>] ?? {};
    return !!map[field];
  };

  // if recurring toggles off, clear recurringType for UX
  useEffect(() => {
    if (!recurringWatch) {
      setValue('recurringType', undefined);
    }
  }, [recurringWatch, setValue]);

  // date helpers
  const dateToTimeString = (d?: Date) => {
    try {
      return d ? format(d, 'HH:mm') : '00:00';
    } catch {
      return '00:00';
    }
  };

  const mergeDateAndTime = (baseDate: Date, timeStr: string) => {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);
    const withHours = setHours(baseDate, h);
    return setMinutes(withHours, m);
  };

  // Submit handler
  const onSubmit = (values: ContestDetailsValues) => {
    if (status === 'CLOSED') {
      setError('title', { type: 'manual', message: 'Contest is closed and cannot be edited.' });
      return;
    }

    const payload: ContestDetailsValues = { ...values };

    if (!payload.isMoneyContest) {
      payload.minPrize = 0;
      payload.maxPrize = 0;
    }

    if (!payload.recurring) {
      payload.recurringType = undefined as any;
    }

    if (status === 'ACTIVE') {
      payload.startDate = new Date(contest.startDate);
    }

    if (payload.startDate >= payload.endDate) {
      setError('endDate', { type: 'manual', message: 'End date must be after start date' });
      return;
    }

    try {
      contestDetailsSchema.parse(payload);
      console.log('SANITIZED PAYLOAD READY FOR SUBMIT:', payload);
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        for (const issue of err.issues) {
          const path = issue.path?.[0] as keyof ContestDetailsValues | undefined;
          if (path) {
            setError(path, { type: 'manual', message: issue.message });
          } else {
            setError('title', { type: 'manual', message: issue.message });
          }
        }
      } else {
        setError('title', { type: 'manual', message: 'Unexpected validation error' });
      }
    }
  };

  // date display extracted from helper util
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

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="text-white"
          disabled={status === 'CLOSED'}
        >
          <Pencil className="mr-2 size-4" /> Edit
        </Button>
      </div>

      <div className="space-y-5 rounded-xl border p-5">
        {/* Creator */}
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
            <div>
              <h3 className="font-medium">{contest?.creator?.fullName}</h3>
              <p className="text-muted-foreground text-sm">{contest?.creator?.email}</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Title</h1>
          <h1 className="text-base font-semibold">{contest?.title}</h1>
        </div>

        {/* Description */}
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
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>Edit Contest Details</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="grid gap-5">
                  {/* Title */}
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!canEditField('title')}
                            placeholder="Enter contest title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <TipTapEditor
                            value={field.value}
                            onChange={field.onChange}
                            // Note: Assuming TipTapEditor handles disabled state if you add a prop for it,
                            // otherwise you might need a wrapper div with pointer-events-none if !canEdit
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Max Uploads */}
                    <FormField
                      control={control}
                      name="maxUploads"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Uploads</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              disabled={!canEditField('maxUploads')}
                              min={1}
                              max={MAX_UPLOADS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Placeholder for alignment */}
                    <div className="hidden md:block"></div>

                    {/* Money Contest Section */}
                    <FormField
                      control={control}
                      name="isMoneyContest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Money Contest</FormLabel>
                            <FormDescription>
                              Enable monetary prizes for this contest
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!canEditField('isMoneyContest')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Recurring Section */}
                    <FormField
                      control={control}
                      name="recurring"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recurring</FormLabel>
                            <FormDescription>Automatically repeat this contest</FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!canEditField('recurring')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Prize Fields - Conditional */}
                    {isMoneyContestWatch && (
                      <>
                        <FormField
                          control={control}
                          name="minPrize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Prize</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                  disabled={!canEditField('minPrize')}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="maxPrize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Prize</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                  disabled={!canEditField('maxPrize')}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Recurring Type - Conditional */}
                    {recurringWatch && (
                      <FormField
                        control={control}
                        name="recurringType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recurring Frequency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!canEditField('recurringType')}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
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
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Start Date & Time */}
                    <FormField
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={!canEditField('startDate')}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP HH:mm')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (!date) return;
                                  const prev = field.value ?? new Date();
                                  const merged = new Date(date);
                                  merged.setHours(prev.getHours(), prev.getMinutes());
                                  field.onChange(merged);
                                }}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                              <div className="border-t p-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="text-muted-foreground size-4" />
                                  <label className="text-xs font-medium">Time:</label>
                                  <Input
                                    type="time"
                                    className="h-8"
                                    value={dateToTimeString(field.value ?? new Date())}
                                    onChange={(e) => {
                                      const newDate = mergeDateAndTime(
                                        field.value ?? new Date(),
                                        e.target.value,
                                      );
                                      field.onChange(newDate);
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date & Time */}
                    <FormField
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={!canEditField('endDate')}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP HH:mm')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (!date) return;
                                  const prev = field.value ?? new Date();
                                  const merged = new Date(date);
                                  merged.setHours(prev.getHours(), prev.getMinutes());
                                  field.onChange(merged);
                                }}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                              <div className="border-t p-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="text-muted-foreground size-4" />
                                  <label className="text-xs font-medium">Time:</label>
                                  <Input
                                    type="time"
                                    className="h-8"
                                    value={dateToTimeString(field.value ?? new Date())}
                                    onChange={(e) => {
                                      const newDate = mergeDateAndTime(
                                        field.value ?? new Date(),
                                        e.target.value,
                                      );
                                      field.onChange(newDate);
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t px-5 py-5">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsTab;
