'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PotyAdminContest } from '@/store/features/contest/types';
import {
  Camera,
  CircleDollarSign,
  Eye,
  Gavel,
  MoreHorizontal,
  Pencil,
  Trash2,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatDate, formatMoney, formatRelative, StageBadge, StageTracker } from './potyUi';

const Stat = ({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) => (
  <div className="min-w-0">
    <p className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase">
      {icon}
      <span className="truncate">{label}</span>
    </p>
    <p className="text-foreground mt-1 truncate text-sm font-semibold tabular-nums">{value}</p>
  </div>
);

// The dates line says what matters at this stage: when it opens, when it
// closes, or when judging became available.
const timingLine = (contest: PotyAdminContest) => {
  switch (contest.stage) {
    case 'SCHEDULED':
      return `Opens ${formatRelative(contest.startDate)} · ${formatDate(contest.startDate, true)}`;
    case 'RUNNING':
      return `Closes ${formatRelative(contest.endDate)} · ${formatDate(contest.endDate, true)}`;
    case 'JUDGING':
      return `Closed ${formatRelative(contest.endDate)} · ready for judging`;
    case 'PUBLISHED':
      return contest.publishedAt
        ? `Published ${formatDate(contest.publishedAt)} · ${contest.winnerCount} winner${contest.winnerCount === 1 ? '' : 's'}`
        : 'Results published';
  }
};

// The single most useful next step for the contest's stage.
const PrimaryAction = ({ contest }: { contest: PotyAdminContest }) => {
  const judgingHref = `/photographer-of-the-year/${contest.id}/judging`;
  switch (contest.stage) {
    case 'JUDGING':
      return (
        <Button asChild size="sm">
          <Link href={judgingHref}>
            <Gavel className="size-3.5" /> Judge now
          </Link>
        </Button>
      );
    case 'PUBLISHED':
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={judgingHref}>
            <Trophy className="size-3.5" /> View results
          </Link>
        </Button>
      );
    case 'RUNNING':
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={judgingHref}>
            <Eye className="size-3.5" /> Live ranking
          </Link>
        </Button>
      );
    default:
      return contest.canEdit ? (
        <Button asChild size="sm" variant="outline">
          <Link href={`/photographer-of-the-year/${contest.id}/edit`}>
            <Pencil className="size-3.5" /> Edit
          </Link>
        </Button>
      ) : null;
  }
};

const PotyContestCard = ({
  contest,
  onDelete,
}: {
  contest: PotyAdminContest;
  onDelete: (contest: PotyAdminContest) => void;
}) => {
  const currency = contest.potyPrizePool?.currency ?? 'USD';
  const needsAttention = contest.stage === 'JUDGING';

  return (
    <article
      className={cn(
        'border-border-subtle bg-surface-secondary overflow-hidden rounded-xl border transition-colors',
        needsAttention && 'border-warning/50 ring-warning/20 ring-1',
      )}
    >
      <div className="flex flex-col md:flex-row">
        <Link
          href={`/contest/${contest.id}`}
          className="bg-surface-tertiary relative block aspect-[16/9] w-full shrink-0 overflow-hidden md:aspect-auto md:w-56"
          aria-label={`Open ${contest.title}`}
        >
          {contest.banner ? (
            <Image
              src={contest.banner}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 224px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Trophy className="text-muted-foreground absolute inset-0 m-auto size-8" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <StageBadge stage={contest.stage} />
              <h3 className="text-heading truncate text-base font-semibold">
                <Link href={`/contest/${contest.id}`} className="hover:underline">
                  {contest.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-xs">{timingLine(contest)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <PrimaryAction contest={contest} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More actions">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuItem asChild>
                    <Link href={`/contest/${contest.id}`}>
                      <Eye className="size-4" /> View details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/photographer-of-the-year/${contest.id}/judging`}>
                      <Gavel className="size-4" /> Rankings &amp; judging
                    </Link>
                  </DropdownMenuItem>
                  {contest.canEdit ? (
                    <DropdownMenuItem asChild>
                      <Link href={`/photographer-of-the-year/${contest.id}/edit`}>
                        <Pencil className="size-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!contest.canDelete}
                    onSelect={() => onDelete(contest)}
                    className="items-start"
                  >
                    <Trash2 className="mt-0.5 size-4" />
                    <span className="flex flex-col">
                      Delete
                      {contest.deleteBlockedReason ? (
                        <span className="text-muted-foreground text-[11px] leading-4">
                          {contest.deleteBlockedReason}
                        </span>
                      ) : null}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <StageTracker stage={contest.stage} />

          <div className="border-border-subtle grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 sm:grid-cols-5">
            <Stat icon={<Camera className="size-3" />} label="Entries" value={contest.entryCount} />
            <Stat
              icon={<Users className="size-3" />}
              label="Photographers"
              value={contest.participantCount}
            />
            <Stat
              icon={<CircleDollarSign className="size-3" />}
              label="Entry fee"
              value={
                contest.entryFeeAmount > 0 ? formatMoney(contest.entryFeeAmount, currency) : 'Free'
              }
            />
            <Stat
              icon={<Wallet className="size-3" />}
              label="Fees collected"
              value={formatMoney(contest.potyPrizePool?.collectedFees, currency)}
            />
            <Stat
              icon={<Trophy className="size-3" />}
              label="Prize pool"
              value={formatMoney(contest.potyPrizePool?.prizePool, currency)}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PotyContestCard;
