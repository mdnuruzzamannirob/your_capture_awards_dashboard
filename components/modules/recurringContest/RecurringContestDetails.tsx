'use client';

import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  getRecurrenceLabel,
  mapRecurringContestToDetailsValues,
  mapRecurringContestToIntervalValues,
} from '@/lib/recurringContest';
import { formatInTimeZone } from '@/lib/timezone';
import { useGetRecurringContestQuery } from '@/store/features/recurringContest/recurringContestApi';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import EditRecurringDetailsDialog from './EditRecurringDetailsDialog';
import EditRecurringIntervalDialog from './EditRecurringIntervalDialog';
import GeneratedContestsPanel from './GeneratedContestsPanel';
import RecurringAwardsPanel from './RecurringAwardsPanel';
import RecurringLevelAwardsPanel from './RecurringLevelAwardsPanel';
import RecurringContestDetailsSkeleton from './RecurringContestDetailsSkeleton';
import RecurringStatusActions from './RecurringStatusActions';

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

const RecurringContestDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading, isFetching } = useGetRecurringContestQuery({ id }, { skip: !id });
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [intervalDialogOpen, setIntervalDialogOpen] = useState(false);

  const contest = data?.data;
  const timezone = contest?.recurring.timezone ?? 'UTC';

  if (isLoading || isFetching) {
    return <RecurringContestDetailsSkeleton />;
  }

  if (!contest?.id) {
    return <div className="text-muted-foreground p-5 text-sm">Recurring contest not found.</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/recurring-contest"
          className="text-caption-foreground hover:text-foreground inline-flex items-center gap-1 text-[10px] font-medium tracking-[0.04em] uppercase transition-colors"
        >
          <ArrowLeft className="size-4" />
          All recurring contests
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-heading text-2xl font-semibold tracking-[-0.02em]">
              {contest.title}
            </h1>
            <span
              className={cn(
                'flex w-fit items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium capitalize',
                contest.status === 'ACTIVE' && 'bg-success/10 text-success',
                contest.status === 'ENDED' && 'bg-destructive/10 text-destructive',
                contest.status === 'PAUSED' && 'bg-warning/10 text-warning',
              )}
            >
              <GoDotFill /> {contest.status.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setIntervalDialogOpen(true)}>
              <Pencil className="size-3.5" /> Schedule
            </Button>
            <Button type="button" variant="outline" onClick={() => setDetailsDialogOpen(true)}>
              <Pencil className="size-3.5" /> Edit details
            </Button>
            <RecurringStatusActions id={contest.id} status={contest.status} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="level-awards">Level Awards</TabsTrigger>
          <TabsTrigger value="generated">Generated Contests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="border-border-subtle bg-surface-secondary space-y-6 rounded-lg border p-5">
            <div>
              <h2 className="text-sm font-semibold">Description</h2>
              <div className="mt-2 text-sm leading-6">
                <TipTapViewer content={contest.description} />
              </div>
            </div>

            <div className="border-border grid gap-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem label="Category" value={contest.category || 'Uncategorized'} />
              <DetailItem label="First occurrence start" value={formatInTimeZone(contest.startDate, timezone)} />
              <DetailItem label="First occurrence end" value={formatInTimeZone(contest.endDate, timezone)} />
              <DetailItem label="Frequency" value={getRecurrenceLabel(contest.recurring.recurringType)} />
              <DetailItem label="Timezone" value={timezone} />
              <DetailItem label="Next occurrence" value={formatInTimeZone(contest.recurring.nextOccurrence, timezone)} />
              <DetailItem
                label="Previous occurrence"
                value={contest.recurring.previousOccurrence ? formatInTimeZone(contest.recurring.previousOccurrence, timezone) : 'None yet'}
              />
              <DetailItem
                label="Recurrence ends"
                value={contest.recurring.endsAt ? formatInTimeZone(contest.recurring.endsAt, timezone) : 'Never'}
              />
              <DetailItem
                label="Max occurrences"
                value={contest.recurring.maxOccurrences ?? 'Unlimited'}
              />
              <DetailItem label="Generated so far" value={contest.recurring.generatedOccurrences ?? 0} />
              <DetailItem label="Entry fee (coins)" value={contest.entryFeeCoins} />
              <DetailItem
                label="Money contest"
                value={
                  contest.isMoneyContest
                    ? `${contest.minPrize ?? 0}–${contest.maxPrize ?? 0} ${contest.currency ?? ''}`
                    : 'No'
                }
              />
              <DetailItem label="Created at" value={formatInTimeZone(contest.createdAt, timezone)} />
              <DetailItem label="Updated at" value={formatInTimeZone(contest.updatedAt, timezone)} />
            </div>

            {Boolean(contest.rules?.length) && (
              <div className="border-border flex flex-wrap gap-1.5 border-t pt-5">
                <Badge variant="outline">{contest.rules?.length ?? 0} rules configured</Badge>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="awards" className="pt-4">
          <RecurringAwardsPanel id={contest.id} />
        </TabsContent>

        <TabsContent value="level-awards" className="pt-4">
          <RecurringLevelAwardsPanel id={contest.id} />
        </TabsContent>

        <TabsContent value="generated" className="pt-4">
          <GeneratedContestsPanel id={contest.id} />
        </TabsContent>
      </Tabs>

      <EditRecurringDetailsDialog
        id={contest.id}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        initialValues={mapRecurringContestToDetailsValues(contest)}
        timezone={timezone}
      />
      <EditRecurringIntervalDialog
        id={contest.id}
        open={intervalDialogOpen}
        onOpenChange={setIntervalDialogOpen}
        initialValues={mapRecurringContestToIntervalValues(contest)}
      />
    </div>
  );
};

export default RecurringContestDetails;
