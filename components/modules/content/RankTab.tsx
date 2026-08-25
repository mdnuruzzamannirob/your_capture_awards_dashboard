'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetContestRankPhotographersQuery,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import type { Contest, RankedPhotographer, RankedPhoto } from '@/store/features/contest/types';
import { useState } from 'react';

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

const RankTab = ({ contest }: { contest: Contest }) => {
  const [activeRankTab, setActiveRankTab] = useState<'top-photo' | 'top-photographer'>('top-photo');
  const { data: rankPhotoData, isFetching: isFetchingPhotos } = useGetContestRankPhotosQuery({
    id: contest.id,
  });
  const { data: rankPhotographerData, isFetching: isFetchingPhotographers } =
    useGetContestRankPhotographersQuery({ id: contest.id });

  const winnerRows = getWinnerRows(contest);
  const rankPhotos =
    rankPhotoData?.data?.photos?.length
      ? rankPhotoData.data.photos
      : (contest.rankPhotos ?? contest.rank?.photos ?? winnerRows.photos);
  const rankPhotographers =
    rankPhotographerData?.data?.participants?.length
      ? rankPhotographerData.data.participants
      : (contest.rankPhotographers ?? contest.rank?.photographers ?? winnerRows.photographers);

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeRankTab} onValueChange={(value) => setActiveRankTab(value as any)}>
        <TabsList className="bg-background/5 grid grid-cols-2 rounded-md">
          <TabsTrigger value="top-photo" className="">
            Top Photo
          </TabsTrigger>
          <TabsTrigger value="top-photographer" className="">
            Top Photographer
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeRankTab === 'top-photo' ? (
        <div className="border-border-subtle bg-surface-secondary rounded-lg border p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rankPhotos.length ? (
              rankPhotos.map((photo, index) => (
                <div
                  key={photo?.contestPhotoId ?? photo?.id ?? index}
                  className="border-border-subtle rounded-lg border p-4"
                >
                  <p className="text-muted-foreground text-sm">#{photo?.rank ?? index + 1}</p>
                  <p className="mt-1 font-medium">
                    {photo?.photographer?.fullName ?? photo?.user?.fullName ?? 'Unknown user'}
                  </p>
                  {typeof photo?.voteCount === 'number' && (
                    <p className="text-muted-foreground text-sm">{photo.voteCount} votes</p>
                  )}
                </div>
              ))
            ) : isFetchingPhotos ? (
              <p className="text-muted-foreground text-sm">Loading ranked photos...</p>
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
                <div
                  key={item?.participantId ?? item?.id ?? index}
                  className="border-border-subtle rounded-lg border p-4"
                >
                  <p className="font-medium">
                    #{item?.rank ?? item?.levelRank ?? index + 1}{' '}
                    {item?.user?.fullName ?? 'Unknown user'}
                  </p>
                  {typeof item?.totalVotes === 'number' && (
                    <p className="text-muted-foreground text-sm">{item.totalVotes} votes</p>
                  )}
                </div>
              ))
            ) : isFetchingPhotographers ? (
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
