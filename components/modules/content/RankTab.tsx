'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetContestRankPhotographersQuery,
  useGetContestRankPhotosQuery,
  useLazyGetContestRankPhotographersQuery,
  useLazyGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import type { Contest, RankedPhotographer, RankedPhoto } from '@/store/features/contest/types';
import { useEffect, useState } from 'react';
import Image from 'next/image';

function getWinnerRows(contest: Contest) {
  const winners = Array.isArray(contest.winners) ? contest.winners : (contest.winners?.data ?? []);
  const topPhotoWinners = winners.filter((winner) => winner.target === 'PHOTO');
  const topPhotographerWinners = winners.filter((winner) => winner.target === 'PHOTOGRAPHER');

  return {
    photos: topPhotoWinners.map<RankedPhoto>((winner) => ({
      contestPhotoId: winner.photo?.id ?? winner.id,
      userPhotoId: winner.photo?.photo?.id,
      url: winner.photo?.photo?.url,
      title: winner.photo?.photo?.title,
      voteCount: undefined,
      rank: winner.rank ?? undefined,
      photographer: winner.user ?? winner.participant?.user ?? null,
    })),
    photographers: topPhotographerWinners.map<RankedPhotographer>((winner) => ({
      participantId: winner.participant?.id ?? winner.id,
      rank: winner.rank ?? undefined,
      user: winner.user ?? winner.participant?.user ?? null,
      totalVotes: undefined,
    })),
  };
}

const POTY_PAGE_SIZE = 100;

// POTY rankings are judged across every entry, so the admin view walks all pages.
async function loadAllPages<T>(loadPage: (page: number) => Promise<T[]>, onProgress: (items: T[]) => void) {
  const collected: T[] = [];
  for (let page = 1; ; page += 1) {
    const items = await loadPage(page);
    collected.push(...items);
    onProgress([...collected]);
    if (items.length < POTY_PAGE_SIZE) return;
  }
}

const RankTab = ({ contest }: { contest: Contest }) => {
  const [activeRankTab, setActiveRankTab] = useState<'top-photo' | 'top-photographer'>('top-photo');
  const [allPotyPhotos, setAllPotyPhotos] = useState<RankedPhoto[]>([]);
  const [allPotyPhotographers, setAllPotyPhotographers] = useState<RankedPhotographer[]>([]);
  const [isLoadingPotyPhotos, setIsLoadingPotyPhotos] = useState(false);
  const [isLoadingPotyPhotographers, setIsLoadingPotyPhotographers] = useState(false);
  const [potyPhotosError, setPotyPhotosError] = useState('');
  const { data: rankPhotoData, isFetching: isFetchingPhotos } = useGetContestRankPhotosQuery(
    { id: contest.id },
    { skip: contest.isPhotographyOfYear },
  );
  const [loadRankPhotos] = useLazyGetContestRankPhotosQuery();
  const [loadRankPhotographers] = useLazyGetContestRankPhotographersQuery();
  const { data: rankPhotographerData, isFetching: isFetchingPhotographers } =
    useGetContestRankPhotographersQuery({ id: contest.id }, { skip: contest.isPhotographyOfYear });

  useEffect(() => {
    if (!contest.isPhotographyOfYear) return;
    let cancelled = false;
    setAllPotyPhotos([]);
    setAllPotyPhotographers([]);
    setPotyPhotosError('');
    setIsLoadingPotyPhotos(true);
    setIsLoadingPotyPhotographers(true);

    void loadAllPages(
      async (page) => {
        const response = await loadRankPhotos({ id: contest.id, page, limit: POTY_PAGE_SIZE, isPhotographyOfYear: true }, false).unwrap();
        return response.data?.photos ?? [];
      },
      (items) => { if (!cancelled) setAllPotyPhotos(items); },
    )
      .catch(() => { if (!cancelled) setPotyPhotosError('Could not load all submitted photos.'); })
      .finally(() => { if (!cancelled) setIsLoadingPotyPhotos(false); });

    void loadAllPages(
      async (page) => {
        const response = await loadRankPhotographers({ id: contest.id, page, limit: POTY_PAGE_SIZE, isPhotographyOfYear: true }, false).unwrap();
        return response.data?.participants ?? [];
      },
      (items) => { if (!cancelled) setAllPotyPhotographers(items); },
    )
      .catch(() => { if (!cancelled) setPotyPhotosError('Could not load all photographers.'); })
      .finally(() => { if (!cancelled) setIsLoadingPotyPhotographers(false); });

    return () => {
      cancelled = true;
    };
  }, [contest.id, contest.isPhotographyOfYear, loadRankPhotos, loadRankPhotographers]);

  const winnerRows = getWinnerRows(contest);
  const rankPhotos = contest.isPhotographyOfYear
    ? allPotyPhotos
    : rankPhotoData?.data?.photos?.length
      ? rankPhotoData.data.photos
      : (contest.rankPhotos ?? contest.rank?.photos ?? winnerRows.photos);
  const rankPhotographers = contest.isPhotographyOfYear
    ? allPotyPhotographers
    : rankPhotographerData?.data?.participants?.length
      ? rankPhotographerData.data.participants
      : (contest.rankPhotographers ?? contest.rank?.photographers ?? winnerRows.photographers);

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeRankTab} onValueChange={(value) => setActiveRankTab(value as any)}>
        <TabsList className="bg-background/5 grid grid-cols-2 rounded-md">
          <TabsTrigger value="top-photo">Top Photo</TabsTrigger>
          <TabsTrigger value="top-photographer">Top Photographer</TabsTrigger>
        </TabsList>
      </Tabs>

      {potyPhotosError ? <p className="text-destructive text-sm">{potyPhotosError}</p> : null}

      {activeRankTab === 'top-photo' ? (
        <div className="border-border-subtle bg-surface-secondary rounded-lg border p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rankPhotos.length ? (
              rankPhotos.map((photo, index) => (
                <div key={photo?.contestPhotoId ?? photo?.id ?? index} className="border-border-subtle rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">#{photo?.rank ?? index + 1}</p>
                  {photo?.url && <Image src={photo.url} alt={photo.title ?? 'Ranked contest photo'} width={480} height={320} unoptimized className="mt-3 aspect-[3/2] w-full rounded-md object-cover" />}
                  <p className="mt-1 font-medium">{photo?.photographer?.fullName ?? photo?.user?.fullName ?? 'Unknown user'}</p>
                  {typeof photo?.voteCount === 'number' && <p className="text-muted-foreground text-sm">{photo.voteCount} votes</p>}
                </div>
              ))
            ) : (isFetchingPhotos || isLoadingPotyPhotos) ? (
              <p className="text-muted-foreground text-sm">Loading ranked photos…</p>
            ) : (
              <p className="text-muted-foreground text-sm">No ranked photos available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="border-border-subtle bg-surface-secondary rounded-lg border p-5">
          <div className="space-y-4">
            {rankPhotographers.length ? (
              rankPhotographers.map((item, index) => (
                <div key={item?.participantId ?? item?.id ?? index} className="border-border-subtle rounded-lg border p-4">
                  <p className="font-medium">#{item?.rank ?? item?.levelRank ?? index + 1} {item?.user?.fullName ?? 'Unknown user'}</p>
                  {typeof item?.totalVotes === 'number' && <p className="text-muted-foreground text-sm">{item.totalVotes} votes</p>}
                </div>
              ))
            ) : (isFetchingPhotographers || isLoadingPotyPhotographers) ? (
              <p className="text-muted-foreground text-sm">Loading ranked photographers...</p>
            ) : (
              <p className="text-muted-foreground text-sm">No ranked photographers available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankTab;
