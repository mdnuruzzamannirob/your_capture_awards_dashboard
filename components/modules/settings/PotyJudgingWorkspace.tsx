'use client';

import { Button } from '@/components/ui/button';
import { cn, formatDateWithTime } from '@/lib/utils';
import {
  useGetPhotographyOfTheYearContestsQuery,
  useGetPhotographyOfTheYearJudgingResultQuery,
  useLazyGetContestRankPhotosQuery,
  useSubmitPhotographyOfTheYearJudgingResultMutation,
} from '@/store/features/contest/contestApi';
import type { Contest, RankedPhoto } from '@/store/features/contest/types';
import { CalendarDays, Check, ChevronRight, Clock3, Loader2, Ticket, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 100;

function placeLabel(index: number) {
  const suffix = index % 100 >= 11 && index % 100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[index % 10] || 'th';
  return `${index + 1}${suffix}`;
}

function photoId(photo: RankedPhoto) {
  return photo.contestPhotoId ?? photo.id ?? photo.userPhotoId ?? photo.url ?? '';
}

function photoLabel(photo: RankedPhoto) {
  return photo.title?.trim() || `Entry #${photo.rank ?? '-'}`;
}

function contestDate(value?: string) {
  const { day, month, year } = formatDateWithTime(value ?? '');
  return day && month && year ? `${day} ${month} ${year}` : 'Not available';
}

function contestDateRange(contest: Contest) {
  return `${contestDate(contest.startDate)} - ${contestDate(contest.endDate)}`;
}

function contestEntryFee(contest: Contest) {
  const amount = Number(contest.entryFeeAmount ?? 0);
  return amount > 0 ? `$${amount.toFixed(2)} entry` : 'Free entry';
}

function getErrorMessage(error: unknown, fallback = 'Could not load submitted photos.') {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

const PotyJudgingWorkspace = () => {
  const { data, isLoading: isLoadingContests } = useGetPhotographyOfTheYearContestsQuery();
  const allContests = data?.data ?? [];
  const contests = useMemo(() => allContests.filter((contest) => contest.status !== 'COMPLETED'), [allContests]);
  const [selectedContestId, setSelectedContestId] = useState('');
  const { currentData: judgingResultData, isFetching: isFetchingJudging } = useGetPhotographyOfTheYearJudgingResultQuery(
    { id: selectedContestId },
    {
      skip: !selectedContestId || contests.find((contest) => contest.id === selectedContestId)?.status !== 'CLOSED',
    },
  );
  const [photos, setPhotos] = useState<RankedPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [winnerIds, setWinnerIds] = useState(['']);
  const [loadPhotos] = useLazyGetContestRankPhotosQuery();
  const [submitJudgingResults, { isLoading: isSavingJudging }] = useSubmitPhotographyOfTheYearJudgingResultMutation();

  useEffect(() => {
    if (!contests.length) {
      if (selectedContestId) setSelectedContestId('');
      return;
    }
    if (!contests.some((contest) => contest.id === selectedContestId)) setSelectedContestId(contests[0].id);
  }, [contests, selectedContestId]);

  useEffect(() => {
    if (!selectedContestId) return;
    const selectedContest = contests.find((contest) => contest.id === selectedContestId);
    if (selectedContest?.status !== 'CLOSED') {
      setPhotos([]);
      setLoadError('');
      setIsLoadingPhotos(false);
      setWinnerIds(['']);
      return;
    }
    let cancelled = false;
    const fetchAll = async () => {
      setPhotos([]);
      setLoadError('');
      setIsLoadingPhotos(true);
      const entries: RankedPhoto[] = [];
      const seen = new Set<string>();
      try {
        let page = 1;
        while (true) {
          const result = await loadPhotos({ id: selectedContestId, page, limit: PAGE_SIZE, isPhotographyOfYear: true }, false).unwrap();
          const batch = result.data?.photos ?? [];
          let added = 0;
          for (const photo of batch) {
            const id = photoId(photo);
            if (!id || seen.has(id)) continue;
            seen.add(id);
            entries.push(photo);
            added += 1;
          }
          if (cancelled) return;
          setPhotos([...entries]);
          if (batch.length < PAGE_SIZE || added === 0) break;
          page += 1;
        }
      } catch (error) {
        if (!cancelled) setLoadError(getErrorMessage(error));
      } finally {
        if (!cancelled) setIsLoadingPhotos(false);
      }
    };
    void fetchAll();
    return () => { cancelled = true; };
  }, [contests, selectedContestId, loadPhotos]);

  useEffect(() => {
    if (!selectedContestId) return;
    const storedWinners = (judgingResultData?.data?.winners ?? []).filter((id, index, winners) => Boolean(id) && winners.indexOf(id) === index);
    setWinnerIds(storedWinners.length ? storedWinners : ['']);
  }, [selectedContestId, judgingResultData]);

  const selectedContest = contests.find((contest) => contest.id === selectedContestId);
  const isJudgingAvailable = selectedContest?.status === 'CLOSED';

  const rankedPhotos = useMemo(
    () => [...photos].sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER)),
    [photos],
  );
  const topTen = useMemo(() => rankedPhotos.slice(0, 10), [rankedPhotos]);
  const topTenIds = useMemo(() => new Set(topTen.map(photoId)), [topTen]);
  const totalVotes = useMemo(
    () => photos.reduce((total, photo) => total + Number(photo.voteCount ?? 0), 0),
    [photos],
  );
  const automaticAdvanceDescription = topTen.length >= 10
    ? 'The 10 highest-ranked photos advance automatically by vote count.'
    : topTen.length > 0
      ? `${topTen.length} highest-ranked ${topTen.length === 1 ? 'photo currently advances' : 'photos currently advance'} by vote count; up to 10 can advance.`
      : 'The highest-ranked photos will advance automatically when entries are available.';
  const winnerPhotos = useMemo(
    () => winnerIds.map((winnerId) => topTen.find((photo) => photoId(photo) === winnerId)),
    [topTen, winnerIds],
  );

  const assignWinner = (id: string, placeIndex: number) => {
    setWinnerIds((current) => {
      const alreadyAssignedHere = current[placeIndex] === id;
      const next = current.map((winner, index) => (index !== placeIndex && winner === id ? '' : winner));
      next[placeIndex] = alreadyAssignedHere ? '' : id;
      return next;
    });
  };

  const clearWinner = (placeIndex: number) => {
    setWinnerIds((current) => current.map((winner, index) => index === placeIndex ? '' : winner));
  };

  const removeWinnerSlot = (placeIndex: number) => {
    setWinnerIds((current) => current.length > 1 ? current.filter((_, index) => index !== placeIndex) : current);
  };

  const addWinnerSlot = () => {
    setWinnerIds((current) => current.length < topTen.length ? [...current, ''] : current);
  };

  const saveDecisions = async () => {
    const winners = winnerIds.filter(Boolean);
    if (!isJudgingAvailable) {
      toast.error('Judging opens after the contest ends.');
      return;
    }
    if (topTen.length < 1) {
      toast.error('At least one ranked photo is required before selecting a winner.');
      return;
    }
    if (winners.length < 1) {
      toast.error('Choose at least one winner from the automatic top 10.');
      return;
    }
    if (winners.some((id) => !topTenIds.has(id))) {
      toast.error('Each winner must come from the automatic top 10 ranking.');
      return;
    }
    try {
      await submitJudgingResults({
        id: selectedContestId,
        body: {
          winnerPhotoIds: winners,
        },
      }).unwrap();
      toast.success(`${winners.length} result${winners.length === 1 ? '' : 's'} published. Participants have been notified.`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not publish the POTY results.'));
    }
  };

  if (isLoadingContests) return <div className="text-muted-foreground flex min-h-40 items-center justify-center">Loading Photographer of the Year contests…</div>;

  return (
    <section className="space-y-5 pt-2">
      <header>
        <h3 className="text-heading flex items-center gap-2 text-lg font-semibold"><Trophy className="text-primary size-5" />Rankings &amp; judging</h3>
        <p className="text-muted-foreground mt-1 text-sm">The vote ranking automatically advances the top 10 photos. Human judges can select one or more winners from that group after the contest ends.</p>
      </header>

      {!contests.length ? (
        <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-6 text-sm">No Photographer of the Year contests are currently awaiting judging.</div>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold">Select a contest</h4>
              <p className="text-muted-foreground mt-1 text-xs">Choose a contest card to open its ranking and judging workspace.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {contests.map((contest: Contest) => {
                const selected = selectedContestId === contest.id;
                const awaitingJudging = contest.status === 'CLOSED';
                const statusLabel = awaitingJudging ? 'Awaiting judging' : contest.status === 'UPCOMING' ? 'Upcoming' : 'Active';
                return (
                  <button
                    key={contest.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedContestId(contest.id)}
                    className={cn(
                      'border-border-subtle bg-surface-secondary group overflow-hidden rounded-xl border text-left transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
                      selected ? 'border-primary ring-1 ring-primary/40' : 'hover:border-primary/50',
                    )}
                  >
                    <div className="bg-surface-tertiary relative aspect-[16/8] overflow-hidden">
                      {contest.banner ? <Image src={contest.banner} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" /> : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
                      <span className={cn(
                        'absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase',
                        awaitingJudging ? 'bg-warning/15 text-warning' : contest.status === 'UPCOMING' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success',
                      )}>{statusLabel}</span>
                      {selected ? <span className="bg-primary text-primary-foreground absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-semibold">Selected</span> : null}
                      <div className="absolute right-4 bottom-3 left-4">
                        <p className="text-white line-clamp-1 text-lg font-semibold">{contest.title}</p>
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="text-muted-foreground grid gap-2 text-xs sm:grid-cols-2">
                        <span className="flex items-center gap-1.5"><CalendarDays className="text-primary size-3.5" />{contestDateRange(contest)}</span>
                        <span className="flex items-center gap-1.5 sm:justify-end"><Ticket className="text-primary size-3.5" />{contestEntryFee(contest)}</span>
                      </div>
                      <div className="text-primary flex items-center justify-between border-t border-border-subtle pt-3 text-xs font-semibold">
                        <span>{contest.status === 'CLOSED' ? (selected ? 'Viewing ranking and judging' : 'Open judging workspace') : 'Judging opens after contest ends'}</span>
                        <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {!isJudgingAvailable ? (
            <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-xl border p-6 text-sm">
              <p className="text-heading font-semibold">Judging is not open yet</p>
              <p className="mt-1">Rankings and winner selection will become available after this contest ends.</p>
            </div>
          ) : <>
          <div className="border-border-subtle bg-surface-secondary rounded-xl border p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase">Automatic round</span>
                  <span className="text-muted-foreground text-xs">{topTen.length} / 10 spots currently filled</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold">Automatic top 10</h4>
                  <p className="text-muted-foreground mt-1 text-sm">{automaticAdvanceDescription}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="border-border-subtle bg-surface rounded-lg border px-4 py-2.5 sm:min-w-32 sm:text-right">
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">Qualifying votes</p>
                  <p className="text-primary mt-1 text-xl leading-none font-semibold tabular-nums">{totalVotes.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-1 text-[10px]">within contest window</p>
                </div>
                <Button type="button" onClick={saveDecisions} disabled={isLoadingPhotos || isFetchingJudging || isSavingJudging || topTen.length < 1} className="w-full sm:w-auto">
                  {isSavingJudging ? 'Publishing and notifying...' : 'Publish selected results'}
                </Button>
              </div>
            </div>

            <div className="border-border-subtle my-5 border-t" />

            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h4 className="text-sm font-semibold">Human judging</h4>
                <p className="text-muted-foreground mt-1 text-xs">Select one or more winners from the automatic top 10. Publishing sends an in-app notification and email.</p>
              </div>
              <span className="text-muted-foreground text-xs">{winnerIds.length} place slot{winnerIds.length === 1 ? '' : 's'}</span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {winnerIds.map((_, index) => {
                const place = placeLabel(index);
                const photo = winnerPhotos[index];
                return (
                  <div key={place} className={`border-border-subtle rounded-lg border p-3 ${photo ? 'bg-primary/5 border-primary/30' : 'bg-surface'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-[11px] font-bold">{place}</span>
                        <span className="text-xs font-semibold">Place</span>
                      </div>
                      {photo ? (
                        <Button type="button" variant="ghost" size="sm" onClick={() => clearWinner(index)} className="text-muted-foreground h-7 px-2 text-xs"><X className="size-3.5" />Clear</Button>
                      ) : winnerIds.length > 1 ? (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeWinnerSlot(index)} className="text-muted-foreground h-7 px-2 text-xs">Remove</Button>
                      ) : null}
                    </div>
                    {photo ? (
                      <div className="mt-3 flex items-center gap-3">
                        {photo.url ? <Image src={photo.url} alt="" width={48} height={48} unoptimized className="size-12 rounded-md object-cover" /> : <div className="bg-surface-tertiary size-12 rounded-md" />}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{photoLabel(photo)}</p>
                          <p className="text-muted-foreground truncate text-xs">#{photo.rank ?? '-'} | {Number(photo.voteCount ?? 0).toLocaleString()} votes</p>
                        </div>
                      </div>
                    ) : <p className="text-muted-foreground mt-3 text-xs">Choose a photo from the ranking below.</p>}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Assign places directly from the ranked photos below. You may publish one winner or add more places as needed.</p>
              <Button type="button" variant="outline" size="sm" onClick={addWinnerSlot} disabled={winnerIds.length >= Math.min(10, topTen.length)}>
                Add another place
              </Button>
            </div>
          </div>

          {loadError ? <p className="text-destructive text-sm">{loadError}</p> : null}
          <div className="flex items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">{isLoadingPhotos ? `Loading all entries… ${photos.length} loaded` : `${photos.length} entries loaded`}</p>
            {isLoadingPhotos ? <Loader2 className="text-muted-foreground size-4 animate-spin" /> : null}
          </div>
          {photos.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rankedPhotos.map((photo, index) => {
                const id = photoId(photo);
                const isTopTen = topTenIds.has(id);
                return (
                  <article key={id} className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
                    {photo.url ? <Image src={photo.url} alt={photo.title || 'Submitted photo'} width={480} height={360} unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="aspect-[4/3] w-full object-cover" /> : <div className="bg-surface-tertiary aspect-[4/3]" />}
                    <div className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-semibold">{photoLabel(photo)}</p>
                        <span className="text-primary shrink-0 text-xs font-bold tabular-nums">#{photo.rank ?? index + 1}</span>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">{photo.photographer?.fullName ?? photo.user?.fullName ?? 'Unknown photographer'}</p>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs"><Clock3 className="text-primary size-3.5" />{Number(photo.voteCount ?? 0).toLocaleString()} votes</p>
                      {isTopTen ? (
                        <>
                          <p className="text-primary flex items-center gap-1.5 text-xs font-semibold"><Check className="size-3.5" />Advances to judging</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {winnerIds.map((_, placeIndex) => {
                              const place = placeLabel(placeIndex);
                              const selected = winnerIds[placeIndex] === id;
                              return <Button key={place} type="button" size="sm" variant={selected ? 'default' : 'outline'} onClick={() => assignWinner(id, placeIndex)} aria-pressed={selected} className="h-8 px-1 text-[11px]">{selected ? <Check className="size-3" /> : null}{place}</Button>;
                            })}
                          </div>
                        </>
                      ) : <p className="text-muted-foreground text-xs">Outside the automatic top 10</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !isLoadingPhotos && !loadError ? (
            <p className="text-muted-foreground rounded-lg border p-8 text-center text-sm">No submitted photos found.</p>
          ) : null}
          </>}
        </>
      )}
    </section>
  );
};

export default PotyJudgingWorkspace;
