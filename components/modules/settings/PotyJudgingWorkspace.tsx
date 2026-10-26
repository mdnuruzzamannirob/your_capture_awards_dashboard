'use client';

import { Button } from '@/components/ui/button';
import { useGetPhotographyOfTheYearContestsQuery, useLazyGetContestRankPhotosQuery } from '@/store/features/contest/contestApi';
import type { Contest, RankedPhoto } from '@/store/features/contest/types';
import { Check, Loader2, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 100;
const STORAGE_KEY = 'poty-judging';
type JudgingDecision = { finalists: string[]; winners: string[] };

function photoId(photo: RankedPhoto) {
  return photo.contestPhotoId ?? photo.id ?? photo.userPhotoId ?? photo.url ?? '';
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Could not load submitted photos.';
}

const PotyJudgingWorkspace = () => {
  const { data, isLoading: isLoadingContests } = useGetPhotographyOfTheYearContestsQuery();
  const contests = data?.data ?? [];
  const [selectedContestId, setSelectedContestId] = useState('');
  const [photos, setPhotos] = useState<RankedPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [finalistIds, setFinalistIds] = useState<string[]>([]);
  const [winnerIds, setWinnerIds] = useState(['', '', '']);
  const [loadPhotos] = useLazyGetContestRankPhotosQuery();

  useEffect(() => {
    if (!selectedContestId && contests[0]?.id) setSelectedContestId(contests[0].id);
  }, [contests, selectedContestId]);

  useEffect(() => {
    if (!selectedContestId) return;
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
  }, [selectedContestId, loadPhotos]);

  useEffect(() => {
    if (!selectedContestId) return;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}:${selectedContestId}`);
      const decision = stored ? JSON.parse(stored) as JudgingDecision : null;
      setFinalistIds(decision?.finalists?.slice(0, 10) ?? []);
      setWinnerIds([...(decision?.winners ?? []), '', '', ''].slice(0, 3));
    } catch {
      setFinalistIds([]);
      setWinnerIds(['', '', '']);
    }
  }, [selectedContestId]);

  const photosById = useMemo(() => new Map(photos.map((photo) => [photoId(photo), photo])), [photos]);
  const finalists = finalistIds.map((id) => photosById.get(id)).filter((photo): photo is RankedPhoto => Boolean(photo));

  const toggleFinalist = (id: string) => {
    if (finalistIds.includes(id)) {
      setFinalistIds((current) => current.filter((item) => item !== id));
      setWinnerIds((current) => current.map((item) => item === id ? '' : item));
    } else if (finalistIds.length >= 10) {
      toast.error('The finalist list is limited to 10 photos.');
    } else {
      setFinalistIds((current) => [...current, id]);
    }
  };

  const saveDecisions = () => {
    const winners = winnerIds.filter(Boolean);
    if (finalistIds.length !== 10) {
      toast.error('Choose 10 finalist photos before saving.');
      return;
    }
    if (winners.length !== 3 || new Set(winners).size !== 3) {
      toast.error('Choose three different winners from the finalists.');
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}:${selectedContestId}`, JSON.stringify({ finalists: finalistIds, winners: winnerIds }));
    toast.success('Judging decisions saved in this browser.');
  };

  if (isLoadingContests) return <div className="text-muted-foreground flex min-h-40 items-center justify-center">Loading Photographer of the Year contests…</div>;

  return (
    <section className="space-y-5 pt-2">
      <header>
        <h3 className="text-heading flex items-center gap-2 text-lg font-semibold"><Trophy className="text-primary size-5" />Judging</h3>
        <p className="text-muted-foreground mt-1 text-sm">Review every submission, select 10 finalists, then choose three different winners.</p>
      </header>

      {!contests.length ? (
        <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-6 text-sm">Create a Photographer of the Year contest in Contest Setup before judging entries.</div>
      ) : (
        <>
          <label className="grid max-w-xl gap-2 text-sm font-medium">
            Contest to judge
            <select value={selectedContestId} onChange={(event) => setSelectedContestId(event.target.value)} className="border-input bg-surface text-foreground h-10 rounded-md border px-3">
              {contests.map((contest: Contest) => <option key={contest.id} value={contest.id}>{contest.title}</option>)}
            </select>
          </label>

          <div className="border-border-subtle bg-surface-secondary rounded-lg border p-4">
            <p className="text-muted-foreground mb-4 text-xs">Judging decisions are stored in this browser. Server side publishing is not available in this dashboard API yet.</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold">Top 10 finalists</p><p className="text-muted-foreground text-sm">{finalistIds.length} of 10 selected</p></div>
              <Button type="button" onClick={saveDecisions} disabled={isLoadingPhotos || !photos.length}>Save judging decisions</Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['First place', 'Second place', 'Third place'].map((place, index) => (
                <label key={place} className="grid gap-1.5 text-xs font-medium">{place}
                  <select value={winnerIds[index] ?? ''} onChange={(event) => setWinnerIds((current) => current.map((id, i) => i === index ? event.target.value : id))} className="border-input bg-surface text-foreground h-9 rounded-md border px-2">
                    <option value="">Choose a finalist</option>
                    {finalists.map((photo) => {
                      const id = photoId(photo);
                      const used = winnerIds.some((winner, winnerIndex) => winnerIndex !== index && winner === id);
                      return <option key={id} value={id} disabled={used}>{photo.title || photo.photographer?.fullName || photo.user?.fullName || id}</option>;
                    })}
                  </select>
                </label>
              ))}
            </div>
          </div>

          {loadError ? <p className="text-destructive text-sm">{loadError}</p> : null}
          <div className="flex items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">{isLoadingPhotos ? `Loading all entries… ${photos.length} loaded` : `${photos.length} entries loaded`}</p>
            {isLoadingPhotos ? <Loader2 className="text-muted-foreground size-4 animate-spin" /> : null}
          </div>
          {photos.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((photo, index) => {
                const id = photoId(photo);
                const selected = finalistIds.includes(id);
                return (
                  <article key={id} className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
                    {photo.url ? <Image src={photo.url} alt={photo.title || 'Submitted photo'} width={480} height={360} unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="aspect-[4/3] w-full object-cover" /> : <div className="bg-surface-tertiary aspect-[4/3]" />}
                    <div className="space-y-2 p-3">
                      <p className="line-clamp-1 text-sm font-semibold">{photo.title || `Entry ${photo.rank ?? index + 1}`}</p>
                      <p className="text-muted-foreground truncate text-xs">{photo.photographer?.fullName ?? photo.user?.fullName ?? 'Unknown photographer'}</p>
                      <Button type="button" variant={selected ? 'default' : 'outline'} className="w-full" onClick={() => toggleFinalist(id)} disabled={!id || (!selected && finalistIds.length >= 10)}>{selected ? <><Check className="size-4" />Finalist</> : 'Select as finalist'}</Button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : !isLoadingPhotos && !loadError ? (
            <p className="text-muted-foreground rounded-lg border p-8 text-center text-sm">No submitted photos found.</p>
          ) : null}
        </>
      )}
    </section>
  );
};

export default PotyJudgingWorkspace;
