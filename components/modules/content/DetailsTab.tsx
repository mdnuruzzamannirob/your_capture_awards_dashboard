'use client';

import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { Button } from '@/components/ui/button';
import { cn, formatDateToDayMonYear, formatDateWithTime } from '@/lib/utils';
import { Info, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { GoDotFill } from 'react-icons/go';

const DetailsTab = ({
  contest: data,
  canEdit = true,
  onEditClick,
}: {
  contest: any;
  canEdit?: boolean;
  onEditClick?: () => void;
}) => {
  const [contest] = useState(data);

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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Details
        </h1>

        {canEdit && (
          <Button onClick={onEditClick} className="text-foreground">
            <Pencil /> Edit
          </Button>
        )}
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
              className="size-10 min-w-10 overflow-hidden rounded-full bg-surface object-cover"
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
          <div className="text-base">

            <TipTapViewer content={contest?.description} />

          </div>
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
                contest?.status === 'ACTIVE' && 'bg-success/10 text-success',
                contest?.status === 'CLOSED' && 'bg-destructive/10 text-destructive',
                contest?.status === 'UPCOMING' && 'bg-warning/10 text-warning',
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
    </div>
  );
};

export default DetailsTab;
