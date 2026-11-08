'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
  useDeleteContestMutation,
  useGetPhotographyOfTheYearContestsQuery,
} from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { Eye, Pencil, Trash2, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;
  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }
  return fallback;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const formatUsd = (value?: number) => `$${Number(value ?? 0).toFixed(2)}`;

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-success-subtle text-success',
  UPCOMING: 'bg-warning-subtle text-warning',
  CLOSED: 'bg-surface-tertiary text-muted-foreground',
  COMPLETED: 'bg-error-subtle text-destructive',
};

// Editing and deleting stay open until the contest's end date. After that the
// contest waits for judging and its entries are frozen.
const isManageable = (contest: Contest) =>
  (contest.status === 'UPCOMING' || contest.status === 'ACTIVE' || contest.status === 'NEW') &&
  new Date(contest.endDate ?? 0).getTime() > Date.now();

const PotyContestList = () => {
  const { data, isLoading, isError, refetch } = useGetPhotographyOfTheYearContestsQuery();
  const [deleteContest, { isLoading: isDeleting }] = useDeleteContestMutation();
  const [pendingDelete, setPendingDelete] = useState<Contest | null>(null);
  const contests = data?.data ?? [];

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      const response = await deleteContest({ id: pendingDelete.id }).unwrap();
      toast.success(response.message || 'Photographer of the Year contest deleted.');
      setPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete the contest.'));
    }
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
        <Spinner className="size-4" /> Loading contests...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground flex items-center justify-between gap-3 rounded-lg border p-4 text-sm">
        Existing contests could not be loaded.
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!contests.length) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-4 text-sm">
        No Photographer of the Year contest exists yet. Create one below.
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-3">
        {contests.map((contest) => {
          const manageable = isManageable(contest);
          return (
            <li
              key={contest.id}
              className="border-border-subtle bg-surface-secondary flex flex-col gap-4 rounded-lg border p-3 sm:flex-row sm:items-center"
            >
              <div className="bg-muted relative h-20 w-full shrink-0 overflow-hidden rounded-md sm:w-32">
                {contest.banner ? (
                  <Image
                    src={contest.banner}
                    alt={contest.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 128px"
                    className="object-cover"
                  />
                ) : (
                  <Trophy className="text-muted-foreground absolute inset-0 m-auto size-6" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-heading truncate font-semibold">{contest.title}</p>
                  <Badge className={cn('text-[11px]', statusStyles[contest.status])}>
                    {contest.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatDate(contest.startDate)} → {formatDate(contest.endDate)}
                </p>
                <p className="text-muted-foreground text-xs">
                  Entry fee{' '}
                  {Number(contest.entryFeeAmount ?? 0) > 0
                    ? formatUsd(contest.entryFeeAmount)
                    : 'Free'}
                  {' · '}Fees collected {formatUsd(contest.potyPrizePool?.collectedFees)}
                  {' · '}Prize pool {formatUsd(contest.potyPrizePool?.prizePool)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/contest/${contest.id}`}>
                    <Eye className="size-4" /> View
                  </Link>
                </Button>
                {manageable ? (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/contest/${contest.id}/edit`}>
                        <Pencil className="size-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(contest)}
                    >
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photographer of the Year contest?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-foreground font-medium">{pendingDelete?.title}</span> will be
              archived and hidden from the website. Entries already submitted are archived with it.
              If anyone has paid the entry fee, refund those payments from the Wallet page first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete contest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PotyContestList;
