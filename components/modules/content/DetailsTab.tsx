'use client';

import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Contest } from '@/store/features/contest/types';
import { Info, Pencil } from 'lucide-react';
import Image from 'next/image';
import { GoDotFill } from 'react-icons/go';

function formatDate(value?: string) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

const DetailsTab = ({
  contest,
  canEdit = true,
  onEditClick,
}: {
  contest: Contest;
  canEdit?: boolean;
  onEditClick?: () => void;
}) => {
  const awardCount = contest.prizes?.length ?? contest.awards?.length ?? 0;
  const creatorName = contest.creator?.fullName ?? 'Unknown creator';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Details
        </h1>
        {canEdit && (
          <Button onClick={onEditClick} className="text-foreground gap-2">
            <Pencil className="size-4" /> Edit
          </Button>
        )}
      </div>

      <div className="border-border bg-surface space-y-6 rounded-xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{contest.title}</h2>
            <div className="mt-3 text-sm leading-6">
              <TipTapViewer content={contest.description} />
            </div>
          </div>
          <span
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium capitalize',
              contest.status === 'ACTIVE' && 'bg-success/10 text-success',
              contest.status === 'CLOSED' && 'bg-destructive/10 text-destructive',
              contest.status === 'UPCOMING' && 'bg-warning/10 text-warning',
            )}
          >
            <GoDotFill /> {contest.status}
          </span>
        </div>

        {contest.creator && (
          <div className="border-border flex items-center gap-3 border-t pt-5">
            {contest.creator.avatar ? (
              <Image
                alt={creatorName}
                src={contest.creator.avatar}
                width={40}
                height={40}
                className="bg-surface-tertiary size-10 rounded-full object-cover"
              />
            ) : (
              <span className="bg-surface-tertiary flex size-10 items-center justify-center rounded-full font-semibold">
                {creatorName.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-medium">{creatorName}</p>
              {contest.creator.email && (
                <p className="text-muted-foreground text-sm">{contest.creator.email}</p>
              )}
            </div>
          </div>
        )}

        <div className="border-border grid gap-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Start date" value={formatDate(contest.startDate)} />
          <DetailItem label="End date" value={formatDate(contest.endDate)} />
          <DetailItem label="Max uploads" value={contest.maxUploads ?? 0} />
          <DetailItem label="Total votes" value={contest.totalVotes ?? 0} />
          <DetailItem
            label="Recurring"
            value={contest.recurring ? (contest.recurringType ?? 'Yes') : 'No'}
          />
          <DetailItem label="Rules" value={contest.rules?.length ?? 0} />
          <DetailItem label="Awards" value={awardCount} />
          <DetailItem label="Joined" value={contest.joined ? 'Yes' : 'No'} />
          <DetailItem label="Created at" value={formatDate(contest.createdAt)} />
          <DetailItem label="Updated at" value={formatDate(contest.updatedAt)} />
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
