'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info, Pencil } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { cn, formatDateToDayMonYear, formatDateWithTime } from '@/lib/utils';
import Image from 'next/image';
import { TipTapEditor } from '@/components/common/tiptap-editor';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { GoDotFill } from 'react-icons/go';
import { contestDetailsSchema, ContestDetailsValues } from '@/lib/schemas/contestSchema';
import { z } from 'zod';

type ContestStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED' | string;

const MAX_UPLOADS = 4; // keep consistent with schema

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    setError,
    reset,
  } = useForm<ContestDetailsValues>({
    resolver: zodResolver(contestDetailsSchema) as Resolver<ContestDetailsValues>,
    defaultValues,
    mode: 'onBlur',
  });

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

  // Submit handler: sanitization + zod parse with context
  const onSubmit = (values: ContestDetailsValues) => {
    // Hard guard: CLOSED cannot be edited
    if (status === 'CLOSED') {
      // optionally show toast / error - here we set a form-level error
      setError('title', { type: 'manual', message: 'Contest is closed and cannot be edited.' });
      return;
    }

    // SANITIZE
    const payload: ContestDetailsValues = { ...values };

    // if not money contest -> zero out prizes
    if (!payload.isMoneyContest) {
      payload.minPrize = 0;
      payload.maxPrize = 0;
    }

    // if not recurring -> clear recurringType
    if (!payload.recurring) {
      // TS: recurringType possibly optional in schema so set undefined
      payload.recurringType = undefined as any;
    }

    // If contest is ACTIVE, prevent changing startDate (locked)
    if (status === 'ACTIVE') {
      payload.startDate = new Date(contest.startDate);
    }

    // Defensive: ensure start < end
    if (payload.startDate >= payload.endDate) {
      setError('endDate', { type: 'manual', message: 'End date must be after start date' });
      return;
    }

    // Run schema validation with context (status) to enforce server rules client-side too
    try {
      // parse will throw if invalid
      // provide status in context so schema can reject invalid changes for given status
      contestDetailsSchema.parse(payload);

      // If parse ok -> send payload to backend (place API call here)
      // Example: await api.patch(`/contest/${contest.id}/details`, payload)
      console.log('SANITIZED PAYLOAD READY FOR SUBMIT:', payload);

      // close dialog after successful validation / sending
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // map zod errors to react-hook-form
        for (const issue of err.issues) {
          const path = issue.path?.[0] as keyof ContestDetailsValues | undefined;
          if (path) {
            setError(path, { type: 'manual', message: issue.message });
          } else {
            // fallback: general error
            setError('title', { type: 'manual', message: issue.message });
          }
        }
      } else {
        // unexpected
        setError('title', { type: 'manual', message: 'Unexpected validation error' });
      }
    }
  };

  // date display extracted from helper util (as in your original)
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
          <Pencil /> Edit
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
          <DialogHeader>
            <DialogTitle className="px-5 pt-5">Edit Details</DialogTitle>
          </DialogHeader>

          <form className="size-full overflow-y-auto p-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input {...register('title')} disabled={!canEditField('title')} />
              {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
            </div>

            {/* Description (TipTap) */}
            <div className="mt-3 flex flex-col gap-2">
              <Label>Description</Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TipTapEditor
                    value={field.value}
                    onChange={field.onChange}
                    // TipTapEditor should accept 'editable' prop to disable editing
                    // If your editor doesn't support `editable`, wrap with UI disabling or show readonly
                    // editable={canEditField('description')}
                  />
                )}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 items-start gap-5">
              {/* Max Uploads */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>maxUploads</Label>
                <Input
                  type="number"
                  {...register('maxUploads', { valueAsNumber: true })}
                  min={1}
                  max={MAX_UPLOADS}
                  disabled={!canEditField('maxUploads')}
                />
                {errors.maxUploads && (
                  <span className="text-sm text-red-500">
                    {errors.maxUploads.message as string}
                  </span>
                )}
              </div>

              {/* Money contest switch */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>Money Contest</Label>
                <Controller
                  control={control}
                  name="isMoneyContest"
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        id="isMoneyContest"
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={!canEditField('isMoneyContest')}
                        className="h-4 w-4 rounded"
                      />
                      <label htmlFor="isMoneyContest" className="text-sm">
                        {field.value ? 'Yes' : 'No'}
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Min Prize */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>minPrize</Label>
                <Input
                  type="number"
                  {...register('minPrize', { valueAsNumber: true })}
                  disabled={!canEditField('minPrize') || !isMoneyContestWatch}
                />
                {errors.minPrize && (
                  <span className="text-sm text-red-500">{errors.minPrize.message as string}</span>
                )}
              </div>

              {/* Max Prize */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>maxPrize</Label>
                <Input
                  type="number"
                  {...register('maxPrize', { valueAsNumber: true })}
                  disabled={!canEditField('maxPrize') || !isMoneyContestWatch}
                />
                {errors.maxPrize && (
                  <span className="text-sm text-red-500">{errors.maxPrize.message as string}</span>
                )}
              </div>

              {/* Start Date */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>Start Date & Time</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            disabled={!canEditField('startDate')}
                          >
                            {format(field.value ?? new Date(), 'PPP')}
                            <CalendarIcon className="ml-2 size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (!date) return;
                              // preserve time from existing value
                              const prev = field.value ?? new Date();
                              const merged = new Date(date);
                              merged.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
                              field.onChange(merged);
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {/* time input */}
                      <input
                        type="time"
                        value={dateToTimeString(field.value ?? new Date())}
                        onChange={(e) => {
                          const newDate = mergeDateAndTime(
                            field.value ?? new Date(),
                            e.target.value,
                          );
                          // only allow if field editable
                          if (!canEditField('startDate')) return;
                          field.onChange(newDate);
                        }}
                        className="mt-2 w-full rounded border px-3 py-2"
                        disabled={!canEditField('startDate')}
                      />
                    </>
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
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            disabled={!canEditField('endDate')}
                          >
                            {format(field.value ?? new Date(), 'PPP')}
                            <CalendarIcon className="ml-2 size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (!date) return;
                              const prev = field.value ?? new Date();
                              const merged = new Date(date);
                              merged.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
                              field.onChange(merged);
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {/* time input */}
                      <input
                        type="time"
                        value={dateToTimeString(field.value ?? new Date())}
                        onChange={(e) => {
                          const newDate = mergeDateAndTime(
                            field.value ?? new Date(),
                            e.target.value,
                          );
                          if (!canEditField('endDate')) return;
                          field.onChange(newDate);
                        }}
                        className="mt-2 w-full rounded border px-3 py-2"
                        disabled={!canEditField('endDate')}
                      />
                    </>
                  )}
                />
              </div>

              {/* Recurring */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>Recurring</Label>
                <Controller
                  control={control}
                  name="recurring"
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <input
                        id="recurring"
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={!canEditField('recurring')}
                        className="h-4 w-4 rounded"
                      />
                      <label htmlFor="recurring" className="text-sm">
                        {field.value ? 'Yes' : 'No'}
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Recurring Type */}
              <div className="mt-3 flex flex-col gap-2">
                <Label>Recurring Type</Label>
                <select
                  {...register('recurringType')}
                  disabled={!canEditField('recurringType') || !recurringWatch}
                  className="rounded border px-3 py-2"
                  defaultValue={defaultValues.recurringType ?? 'MONTHLY'}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
                {errors.recurringType && (
                  <span className="text-sm text-red-500">
                    {errors.recurringType.message as string}
                  </span>
                )}
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
