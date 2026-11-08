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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  useGetContestRankPhotosQuery,
  useGetPhotographyOfTheYearJudgingResultQuery,
  useGetPotyAdminOverviewQuery,
  useSubmitPhotographyOfTheYearJudgingResultMutation,
} from '@/store/features/contest/contestApi';
import type { PotyAdminContest, RankedPhoto } from '@/store/features/contest/types';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gavel,
  Info,
  Loader2,
  Pencil,
  Plus,
  Send,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  formatDate,
  formatMoney,
  formatRelative,
  getErrorMessage,
  placeLabel,
  StageBadge,
  StageTracker,
} from './potyUi';

const MAX_WINNERS = 10;
const ENTRIES_PAGE_SIZE = 24;

const entryId = (photo: RankedPhoto) => photo.contestPhotoId ?? photo.id ?? '';
const entryTitle = (photo: RankedPhoto) => photo.title?.trim() || `Entry #${photo.rank ?? '–'}`;
const photographerName = (photo: RankedPhoto) => {
  const user = photo.photographer ?? photo.user;
  return user?.fullName || user?.username || 'Unknown photographer';
};
const votesLabel = (photo: RankedPhoto) => {
  const votes = Number(photo.voteCount ?? 0).toLocaleString();
  return typeof photo.voterCount === 'number'
    ? `${votes} votes · ${photo.voterCount.toLocaleString()} voters`
    : `${votes} votes`;
};

// The judge's unpublished picks survive a reload or a closed tab on this device.
const draftKey = (contestId: string) => `poty-judging-draft:${contestId}`;
const readDraft = (contestId: string): string[] => {
  try {
    const raw = window.localStorage.getItem(draftKey(contestId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};
const writeDraft = (contestId: string, ids: string[]) => {
  try {
    if (ids.length) window.localStorage.setItem(draftKey(contestId), JSON.stringify(ids));
    else window.localStorage.removeItem(draftKey(contestId));
  } catch {
    // Storage can be unavailable (private mode); the draft just won't persist.
  }
};

const StageNotice = ({ contest }: { contest: PotyAdminContest }) => {
  const notice = {
    SCHEDULED: {
      tone: 'border-info/30 bg-info-subtle',
      text: `The contest opens ${formatRelative(contest.startDate)} (${formatDate(contest.startDate, true)}). The ranking fills in once photographers start entering.`,
    },
    RUNNING: {
      tone: 'border-success/30 bg-success-subtle',
      text: `Live preview. Judging opens when the contest closes ${formatRelative(contest.endDate)} (${formatDate(contest.endDate, true)}). The top 10 can still change until then.`,
    },
    JUDGING: {
      tone: 'border-warning/40 bg-warning-subtle',
      text: 'Choose your winners from the top 10, put them in order, then publish. Nothing is sent until you publish.',
    },
    PUBLISHED: {
      tone: 'border-primary/30 bg-primary-soft',
      text: `Results were published${contest.publishedAt ? ` on ${formatDate(contest.publishedAt)}` : ''} and every winner was notified. Published results cannot be changed.`,
    },
  }[contest.stage];
  return (
    <div
      className={cn('flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm', notice.tone)}
    >
      <Info className="text-foreground/70 mt-0.5 size-4 shrink-0" />
      <p className="text-foreground/90">{notice.text}</p>
    </div>
  );
};

const PotyJudging = ({ contestId }: { contestId: string }) => {
  const { data: overviewData, isLoading: isLoadingOverview } = useGetPotyAdminOverviewQuery();
  const contest = overviewData?.data?.contests.find((item) => item.id === contestId);
  const stage = contest?.stage;
  const canJudge = stage === 'JUDGING';
  const isPublished = stage === 'PUBLISHED';

  const {
    data: topData,
    isLoading: isLoadingTop,
    isError: isTopError,
    refetch: refetchTop,
  } = useGetContestRankPhotosQuery(
    { id: contestId, page: 1, limit: MAX_WINNERS, isPhotographyOfYear: true },
    { skip: !contest },
  );
  const topTen = useMemo(() => topData?.data?.photos ?? [], [topData]);
  const topById = useMemo(() => new Map(topTen.map((photo) => [entryId(photo), photo])), [topTen]);

  const { data: resultData } = useGetPhotographyOfTheYearJudgingResultQuery(
    { id: contestId },
    { skip: !isPublished },
  );
  const [submitResults, { isLoading: isPublishing }] =
    useSubmitPhotographyOfTheYearJudgingResultMutation();

  const [winnerIds, setWinnerIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [preview, setPreview] = useState<RankedPhoto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [entriesPage, setEntriesPage] = useState(1);

  // Published contests show the saved result; open judging restores the
  // judge's draft, keeping only picks that are still in the top 10.
  useEffect(() => {
    if (!contest || isLoadingTop) return;
    if (isPublished) {
      setWinnerIds(resultData?.data?.winners ?? []);
    } else if (canJudge && !hydrated) {
      setWinnerIds(readDraft(contestId).filter((id) => topById.has(id)));
      setHydrated(true);
    }
  }, [contest, isLoadingTop, isPublished, canJudge, hydrated, resultData, contestId, topById]);

  useEffect(() => {
    if (canJudge && hydrated) writeDraft(contestId, winnerIds);
  }, [canJudge, hydrated, contestId, winnerIds]);

  const { data: entriesData, isFetching: isFetchingEntries } = useGetContestRankPhotosQuery(
    { id: contestId, page: entriesPage, limit: ENTRIES_PAGE_SIZE, isPhotographyOfYear: true },
    { skip: !contest || !showAllEntries },
  );
  const entries = entriesData?.data?.photos ?? [];
  const entriesMeta = entriesData?.data?.meta as { total?: number; totalPage?: number } | undefined;
  const totalPages = Math.max(1, entriesMeta?.totalPage ?? 1);

  const toggleWinner = (id: string) => {
    if (!canJudge) return;
    setWinnerIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < MAX_WINNERS
          ? [...current, id]
          : current,
    );
  };
  const move = (index: number, delta: -1 | 1) => {
    setWinnerIds((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const publish = async () => {
    try {
      await submitResults({ id: contestId, body: { winnerPhotoIds: winnerIds } }).unwrap();
      writeDraft(contestId, []);
      setConfirmOpen(false);
      toast.success(
        `${winnerIds.length} winner${winnerIds.length === 1 ? '' : 's'} published and notified.`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not publish the results.'));
    }
  };

  if (isLoadingOverview) {
    return (
      <div className="text-muted-foreground flex min-h-60 items-center justify-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading contest…
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-xl border p-8 text-center text-sm">
        <p>This Photographer of the Year contest was not found. It may have been deleted.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/photographer-of-the-year">Back to Photographer of the Year</Link>
        </Button>
      </div>
    );
  }

  const currency = contest.potyPrizePool?.currency ?? 'USD';
  const placeOf = (id: string) => winnerIds.indexOf(id);

  const photoCard = (photo: RankedPhoto) => {
    const id = entryId(photo);
    const place = placeOf(id);
    const selected = place !== -1;
    return (
      <article
        key={id}
        className={cn(
          'border-border-subtle bg-surface-secondary group overflow-hidden rounded-xl border transition-colors',
          selected && 'border-primary ring-primary/30 ring-1',
        )}
      >
        <button
          type="button"
          onClick={() => setPreview(photo)}
          className="bg-surface-tertiary relative block aspect-[4/3] w-full overflow-hidden"
          aria-label={`Preview ${entryTitle(photo)}`}
        >
          {photo.url ? (
            <Image
              src={photo.url}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
            #{photo.rank}
          </span>
          {selected ? (
            <span className="bg-primary text-primary-foreground absolute top-2 right-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold">
              <Trophy className="size-3" /> {placeLabel(place)}
            </span>
          ) : null}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/70 to-transparent py-2 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Eye className="size-3.5" /> Preview
          </span>
        </button>
        <div className="space-y-2 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{entryTitle(photo)}</p>
            <p className="text-muted-foreground truncate text-xs">{photographerName(photo)}</p>
          </div>
          <p className="text-muted-foreground text-xs tabular-nums">{votesLabel(photo)}</p>
          {canJudge ? (
            <Button
              type="button"
              size="sm"
              variant={selected ? 'default' : 'outline'}
              className="w-full"
              onClick={() => toggleWinner(id)}
              disabled={!selected && winnerIds.length >= MAX_WINNERS}
            >
              {selected ? (
                <>
                  <Check className="size-3.5" /> {placeLabel(place)} place · remove
                </>
              ) : (
                <>
                  <Plus className="size-3.5" /> Add as {placeLabel(winnerIds.length)} place
                </>
              )}
            </Button>
          ) : null}
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/photographer-of-the-year"
          className="text-caption-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.04em] uppercase"
        >
          <ArrowLeft className="size-4" /> Photographer of the Year
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <StageBadge stage={contest.stage} />
            <h1 className="text-heading text-2xl leading-tight font-semibold tracking-tight">
              {contest.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {formatDate(contest.startDate, true)} → {formatDate(contest.endDate, true)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/contest/${contest.id}`}>
                <Eye className="size-3.5" /> Contest details
              </Link>
            </Button>
            {contest.canEdit ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/photographer-of-the-year/${contest.id}/edit`}>
                  <Pencil className="size-3.5" /> Edit
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        <StageTracker stage={contest.stage} className="max-w-3xl" />
      </div>

      <StageNotice contest={contest} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Camera, label: 'Entries', value: contest.entryCount.toLocaleString() },
          { icon: Users, label: 'Photographers', value: contest.participantCount.toLocaleString() },
          {
            icon: Trophy,
            label: 'Prize pool',
            value: formatMoney(contest.potyPrizePool?.prizePool, currency),
          },
          {
            icon: Gavel,
            label: isPublished ? 'Winners' : 'Winners selected',
            value: `${winnerIds.length} / ${Math.min(MAX_WINNERS, topTen.length || MAX_WINNERS)}`,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border-border-subtle bg-surface-secondary rounded-xl border px-4 py-3"
          >
            <p className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
              <Icon className="size-3.5" /> {label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Top 10 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-heading text-base font-semibold">
              {contest.stage === 'RUNNING' || contest.stage === 'SCHEDULED'
                ? 'Current top 10'
                : 'Top 10 finalists'}
            </h2>
            <p className="text-muted-foreground text-xs">
              Ranked by weighted votes the photos earned in regular contests during the POTY window.
              Only these photos can win.
            </p>
          </div>
          {isLoadingTop ? (
            <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
              <Loader2 className="size-4 animate-spin" /> Loading ranking…
            </div>
          ) : isTopError ? (
            <div className="border-border-subtle text-muted-foreground flex items-center justify-between gap-3 rounded-xl border p-4 text-sm">
              The ranking could not be loaded.
              <Button size="sm" variant="outline" onClick={() => refetchTop()}>
                Retry
              </Button>
            </div>
          ) : topTen.length ? (
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{topTen.map(photoCard)}</div>
          ) : (
            <p className="border-border-subtle text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
              No ranked entries yet.
            </p>
          )}
        </section>

        {/* Winners panel */}
        <aside className="border-border-subtle bg-surface-secondary space-y-4 rounded-xl border p-4 xl:sticky xl:top-20">
          <div>
            <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
              <Trophy className="text-primary size-4" />
              {isPublished ? 'Published winners' : 'Your winners'}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {isPublished
                ? 'In the order they were announced.'
                : canJudge
                  ? 'Add photos from the top 10 in the order you want them placed. Use the arrows to reorder.'
                  : `Judging opens ${formatRelative(contest.endDate)}.`}
            </p>
          </div>

          {winnerIds.length ? (
            <ol className="space-y-2">
              {winnerIds.map((id, index) => {
                const photo = topById.get(id);
                return (
                  <li
                    key={id}
                    className="border-border-subtle bg-surface flex items-center gap-2.5 rounded-lg border p-2"
                  >
                    <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                      {placeLabel(index)}
                    </span>
                    <button
                      type="button"
                      onClick={() => photo && setPreview(photo)}
                      className="bg-surface-tertiary relative size-10 shrink-0 overflow-hidden rounded-md"
                      aria-label="Preview"
                    >
                      {photo?.url ? (
                        <Image
                          src={photo.url}
                          alt=""
                          fill
                          unoptimized
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {photo ? entryTitle(photo) : 'Entry no longer in the top 10'}
                      </p>
                      <p className="text-muted-foreground truncate text-[11px]">
                        {photo ? `#${photo.rank} · ${photographerName(photo)}` : id}
                      </p>
                    </div>
                    {canJudge ? (
                      <div className="flex shrink-0 items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => move(index, 1)}
                          disabled={index === winnerIds.length - 1}
                          aria-label="Move down"
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => toggleWinner(id)}
                          aria-label="Remove"
                        >
                          <X />
                        </Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="border-border-subtle text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
              {canJudge ? 'No winners picked yet.' : 'No winners yet.'}
            </p>
          )}

          {canJudge ? (
            <div className="border-border-subtle space-y-2 border-t pt-3">
              <Button
                type="button"
                className="w-full"
                disabled={!winnerIds.length || isPublishing}
                onClick={() => setConfirmOpen(true)}
              >
                <Send className="size-4" /> Review &amp; publish
              </Button>
              <p className="text-muted-foreground text-[11px]">
                Your picks are saved as a draft on this device until you publish.
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Every entry, paged, only when asked for */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-heading text-base font-semibold">All entries</h2>
            <p className="text-muted-foreground text-xs">
              {contest.entryCount.toLocaleString()} entries in ranking order.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAllEntries((value) => !value)}
          >
            {showAllEntries ? 'Hide entries' : 'Browse all entries'}
          </Button>
        </div>
        {showAllEntries ? (
          <>
            {isFetchingEntries && !entries.length ? (
              <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
                <Loader2 className="size-4 animate-spin" /> Loading entries…
              </div>
            ) : entries.length ? (
              <div
                className={cn(
                  'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
                  isFetchingEntries && 'opacity-60',
                )}
              >
                {entries.map((photo) =>
                  topById.has(entryId(photo)) ? (
                    photoCard(photo)
                  ) : (
                    <article
                      key={entryId(photo)}
                      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-xl border"
                    >
                      <button
                        type="button"
                        onClick={() => setPreview(photo)}
                        className="bg-surface-tertiary relative block aspect-[4/3] w-full overflow-hidden"
                        aria-label={`Preview ${entryTitle(photo)}`}
                      >
                        {photo.url ? (
                          <Image
                            src={photo.url}
                            alt=""
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className="object-cover"
                          />
                        ) : null}
                        <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
                          #{photo.rank}
                        </span>
                      </button>
                      <div className="p-3">
                        <p className="truncate text-sm font-semibold">{entryTitle(photo)}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {photographerName(photo)} · {votesLabel(photo)}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No entries yet.</p>
            )}
            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3 text-sm">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEntriesPage((page) => Math.max(1, page - 1))}
                  disabled={entriesPage <= 1 || isFetchingEntries}
                >
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <span className="text-muted-foreground tabular-nums">
                  Page {entriesPage} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEntriesPage((page) => Math.min(totalPages, page + 1))}
                  disabled={entriesPage >= totalPages || isFetchingEntries}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      {/* Large preview */}
      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="sm:max-w-4xl">
          {preview ? (
            <>
              <div className="bg-surface-tertiary relative h-[60vh] w-full overflow-hidden rounded-lg">
                {preview.url ? (
                  <Image
                    src={preview.url}
                    alt={entryTitle(preview)}
                    fill
                    unoptimized
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-contain"
                  />
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <DialogTitle className="truncate">
                    #{preview.rank} · {entryTitle(preview)}
                  </DialogTitle>
                  <DialogDescription>
                    {photographerName(preview)} · {votesLabel(preview)}
                  </DialogDescription>
                </div>
                {canJudge && topById.has(entryId(preview)) ? (
                  <Button
                    type="button"
                    variant={placeOf(entryId(preview)) !== -1 ? 'default' : 'outline'}
                    onClick={() => toggleWinner(entryId(preview))}
                    disabled={placeOf(entryId(preview)) === -1 && winnerIds.length >= MAX_WINNERS}
                  >
                    {placeOf(entryId(preview)) !== -1 ? (
                      <>
                        <Check className="size-4" /> {placeLabel(placeOf(entryId(preview)))} place ·
                        remove
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" /> Add as {placeLabel(winnerIds.length)} place
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Publish confirmation */}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isPublishing) setConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Publish {winnerIds.length} winner{winnerIds.length === 1 ? '' : 's'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Each winner gets an email and an in-app notification, and the contest is marked
              completed. Published results cannot be changed afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ol className="space-y-1.5">
            {winnerIds.map((id, index) => {
              const photo = topById.get(id);
              return (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <span className="text-primary w-10 shrink-0 font-bold">{placeLabel(index)}</span>
                  <span className="truncate">
                    {photo ? `${entryTitle(photo)} — ${photographerName(photo)}` : id}
                  </span>
                </li>
              );
            })}
          </ol>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void publish();
              }}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Publishing…
                </>
              ) : (
                'Publish and notify'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PotyJudging;
