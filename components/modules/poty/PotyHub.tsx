'use client';

import MetricCard from '@/components/common/MetricCard';
import Title from '@/components/common/Title';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useGetPotyAdminOverviewQuery } from '@/store/features/contest/contestApi';
import type { PotyAdminContest, PotyStage } from '@/store/features/contest/types';
import { FileText, Gavel, Plus, Trophy, Upload, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import PotyContestCard from './PotyContestCard';
import PotyDeleteDialog from './PotyDeleteDialog';
import PotyLearnMore from './PotyLearnMore';
import { formatMoney, STAGE_META, STAGE_PRIORITY } from './potyUi';

type Filter = 'ALL' | PotyStage;

const Skeleton = ({ className }: { className: string }) => (
  <div className={cn('bg-surface-tertiary animate-pulse rounded-md', className)} />
);

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'JUDGING', label: 'Needs judging' },
  { value: 'RUNNING', label: 'Accepting entries' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'PUBLISHED', label: 'Published' },
];

const ContestListSkeleton = () => (
  <div className="grid gap-3">
    {[0, 1].map((key) => (
      <div
        key={key}
        className="border-border-subtle bg-surface-secondary flex flex-col gap-4 rounded-xl border p-4 md:flex-row"
      >
        <Skeleton className="aspect-[16/9] w-full md:aspect-auto md:h-36 md:w-52" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    ))}
  </div>
);

const ContestsView = () => {
  const { data, isLoading, isError, refetch } = useGetPotyAdminOverviewQuery();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [pendingDelete, setPendingDelete] = useState<PotyAdminContest | null>(null);

  const overview = data?.data;
  const contests = useMemo(
    () =>
      [...(overview?.contests ?? [])].sort(
        (a, b) =>
          STAGE_PRIORITY[a.stage] - STAGE_PRIORITY[b.stage] ||
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
    [overview],
  );
  const counts = useMemo(() => {
    const byStage: Record<Filter, number> = {
      ALL: contests.length,
      SCHEDULED: 0,
      RUNNING: 0,
      JUDGING: 0,
      PUBLISHED: 0,
    };
    contests.forEach((contest) => {
      byStage[contest.stage] += 1;
    });
    return byStage;
  }, [contests]);
  const visible = filter === 'ALL' ? contests : contests.filter((c) => c.stage === filter);
  const awaitingJudging = contests.filter((contest) => contest.stage === 'JUDGING');
  const totals = overview?.totals;

  if (isError) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground flex flex-wrap items-center justify-between gap-3 rounded-xl border p-5 text-sm">
        Photographer of the Year contests could not be loaded.
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label="Accepting entries"
          value={isLoading ? '…' : (totals?.running ?? 0)}
          icon={Upload}
        />
        <MetricCard
          label="Awaiting judging"
          value={isLoading ? '…' : (totals?.awaitingJudging ?? 0)}
          icon={Gavel}
          className={cn(totals?.awaitingJudging ? 'border-warning/50' : undefined)}
        />
        <MetricCard
          label="Total entries"
          value={isLoading ? '…' : (totals?.entries ?? 0).toLocaleString()}
          icon={Trophy}
        />
        <MetricCard
          label="Fees collected · prize pool"
          value={
            isLoading
              ? '…'
              : `${formatMoney(totals?.collectedFees, totals?.currency)} · ${formatMoney(totals?.prizePool, totals?.currency)}`
          }
          icon={Wallet}
        />
      </div>

      {awaitingJudging.length ? (
        <div className="border-warning/40 bg-warning-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <div className="flex items-start gap-3">
            <Gavel className="text-warning mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-foreground text-sm font-semibold">
                {awaitingJudging.length === 1
                  ? `“${awaitingJudging[0].title}” is waiting for judging`
                  : `${awaitingJudging.length} contests are waiting for judging`}
              </p>
              <p className="text-muted-foreground text-xs">{STAGE_META.JUDGING.hint}</p>
            </div>
          </div>
          {awaitingJudging.length === 1 ? (
            <Button asChild size="sm">
              <Link href={`/photographer-of-the-year/${awaitingJudging[0].id}/judging`}>
                <Gavel className="size-3.5" /> Judge now
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setFilter('JUDGING')}>
              Show them
            </Button>
          )}
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter contests">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                filter === item.value
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border-subtle text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
              <span className="tabular-nums opacity-70">{counts[item.value]}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <ContestListSkeleton />
        ) : !contests.length ? (
          <div className="border-border-subtle bg-surface-secondary flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
            <Trophy className="text-primary size-8" />
            <div>
              <p className="text-heading font-semibold">No Photographer of the Year contest yet</p>
              <p className="text-muted-foreground mt-1 max-w-md text-sm">
                Create the annual contest. Photographers enter their best work, votes from regular
                contests rank it, and you pick the winners from the top 10.
              </p>
            </div>
            <Button asChild>
              <Link href="/photographer-of-the-year/new">
                <Plus className="size-4" /> Create contest
              </Link>
            </Button>
          </div>
        ) : !visible.length ? (
          <p className="border-border-subtle text-muted-foreground rounded-xl border p-6 text-center text-sm">
            No contests in this stage.
          </p>
        ) : (
          <div className="grid gap-3">
            {visible.map((contest) => (
              <PotyContestCard key={contest.id} contest={contest} onDelete={setPendingDelete} />
            ))}
          </div>
        )}
      </div>

      {pendingDelete ? (
        <PotyDeleteDialog
          contestId={pendingDelete.id}
          title={pendingDelete.title}
          open
          onOpenChange={(open) => {
            if (!open) setPendingDelete(null);
          }}
        />
      ) : null}
    </div>
  );
};

const PotyHub = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <Title
        title="Photographer of the Year"
        description="Run the annual contest from one place: create it, follow entries and rankings, judge the top 10 and publish the winners."
      />
      <Button asChild>
        <Link href="/photographer-of-the-year/new">
          <Plus className="size-4" /> New contest
        </Link>
      </Button>
    </div>

    <Tabs defaultValue="contests" className="gap-5">
      <TabsList className="h-10">
        <TabsTrigger value="contests" className="px-4">
          <Trophy className="size-4" /> Contests
        </TabsTrigger>
        <TabsTrigger value="learn-more" className="px-4">
          <FileText className="size-4" /> Learn More page
        </TabsTrigger>
      </TabsList>
      <TabsContent value="contests">
        <ContestsView />
      </TabsContent>
      <TabsContent value="learn-more">
        <PotyLearnMore />
      </TabsContent>
    </Tabs>
  </div>
);

export default PotyHub;
