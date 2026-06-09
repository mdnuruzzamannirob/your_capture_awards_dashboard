'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { cn, formatDateToDayMonYear, formatDateWithTime } from '@/lib/utils';
import Image from 'next/image';
import { GoDotFill } from 'react-icons/go';

const DetailsTab = ({ contest: data }: { contest: any }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contest] = useState(data);
  const [formData, setFormData] = useState({
    title: contest?.title ?? '',
    description: contest?.description ?? '',
    isMoneyContest: Boolean(contest?.isMoneyContest),
    minPrize: contest?.minPrize ?? 0,
    maxPrize: contest?.maxPrize ?? 0,
    coin_requirement: Boolean(contest?.coin_requirement),
    coin_required: contest?.coin_required ?? 0,
    status: contest?.status ?? 'ACTIVE',
    maxUploads: contest?.maxUploads ?? 4,
    startDate: contest?.startDate ? new Date(contest.startDate) : new Date(),
    endDate: contest?.endDate ? new Date(contest.endDate) : new Date(),
  });

  const {
    day: startDay,
    hours: startHours,
    minutes: startMinutes,
    month: startMonth,
    timeZone: startTimeZone,
    year: startYear,
  } = formatDateWithTime(contest?.startDate);
  const {
    day: endDay,
    hours: endHours,
    minutes: endMinutes,
    month: endMonth,
    timeZone: endTimeZone,
    year: endYear,
  } = formatDateWithTime(contest?.endDate);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

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
            <div>
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
          <p className="text-base">{contest?.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-5 text-sm md:grid-cols-3">
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Money Contest</h1>
            <p className="text-base font-semibold">{contest?.isMoneyContest ? 'Yes' : 'No'}</p>
          </div>
          {contest?.isMoneyContest && (
            <>
              <div className="space-y-1">
                <h1 className="text-muted-foreground font-medium">Min Prize</h1>
                <p className="text-base font-semibold">{contest?.minPrize ?? 0}</p>
              </div>
              <div className="space-y-1">
                <h1 className="text-muted-foreground font-medium">Max Prize</h1>
                <p className="text-base font-semibold">{contest?.maxPrize ?? 0}</p>
              </div>
            </>
          )}
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Coin Requirement</h1>
            <p className="text-base font-semibold">{contest?.coin_requirement ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Required Coins</h1>
            <p className="text-base font-semibold">{contest?.coin_required ?? 0}</p>
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
            <h1 className="text-muted-foreground font-medium">Status</h1>
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
            <h1 className="text-muted-foreground font-medium">Max Upload</h1>
            <p className="text-base font-semibold">{contest?.maxUploads}</p>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 sm:max-h-[80vh] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
          </DialogHeader>
          <form className="size-full overflow-y-auto">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 space-y-5">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.isMoneyContest}
                  onCheckedChange={(val) => handleChange('isMoneyContest', val)}
                />
                <Label>Is money contest</Label>
              </div>

              {formData.isMoneyContest && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Min Prize</Label>
                    <Input
                      type="number"
                      value={formData.minPrize}
                      onChange={(e) => handleChange('minPrize', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Max Prize</Label>
                    <Input
                      type="number"
                      value={formData.maxPrize}
                      onChange={(e) => handleChange('maxPrize', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.coin_requirement}
                  onCheckedChange={(val) => handleChange('coin_requirement', val)}
                />
                <Label>Coin requirement</Label>
              </div>

              {formData.coin_requirement && (
                <div className="flex flex-col gap-2">
                  <Label>Required coins</Label>
                  <Input
                    type="number"
                    value={formData.coin_required}
                    onChange={(e) => handleChange('coin_required', parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Input value={formData.status} onChange={(e) => handleChange('status', e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Max Upload</Label>
                <Input
                  type="number"
                  value={formData.maxUploads}
                  onChange={(e) => handleChange('maxUploads', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {format(formData.startDate, 'PPP')}
                      <CalendarIcon className="ml-2 size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && handleChange('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {format(formData.endDate, 'PPP')}
                      <CalendarIcon className="ml-2 size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && handleChange('endDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsTab;
