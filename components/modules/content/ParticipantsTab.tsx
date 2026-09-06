'use client';

import {
  useGetContestParticipantsQuery,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import { Input } from '@/components/ui/input';
import type { Contest, RankedPhoto } from '@/store/features/contest/types';
import { ImageOff, Vote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const ParticipantsTab = ({ contest }: { contest: Contest }) => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetContestParticipantsQuery({
    contestId: contest.id,
    search: search || undefined,
  });
  const participants = data?.data ?? [];

  // Reuse the rank-photos endpoint (same one the Rank/Photos tabs use) to pull every
  // submitted photo, then group by photographer so each participant row can show
  // their own uploads without a separate per-user endpoint.
  const { data: photosData, isLoading: isPhotosLoading } = useGetContestRankPhotosQuery({
    id: contest.id,
    limit: 100, // backend caps at 100 regardless of what's requested
  });

  const photosByUserId = useMemo(() => {
    const map = new Map<string, RankedPhoto[]>();
    (photosData?.data?.photos ?? []).forEach((photo) => {
      const userId = photo.photographer?.id ?? photo.user?.id;
      if (!userId) return;
      const existing = map.get(userId) ?? [];
      existing.push(photo);
      map.set(userId, existing);
    });
    return map;
  }, [photosData]);

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Search participants by username or name..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="max-w-sm"
      />

      <div className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
        {isLoading || isFetching ? (
          <p className="text-muted-foreground p-5 text-sm">Loading participants...</p>
        ) : participants.length ? (
          <ul className="divide-border-subtle divide-y">
            {participants.map((participant) => {
              const photos = participant.user?.id ? (photosByUserId.get(participant.user.id) ?? []) : [];

              return (
                <li key={participant.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted relative size-9 shrink-0 overflow-hidden rounded-full">
                      {participant.user?.avatar && (
                        <Image
                          src={participant.user.avatar}
                          alt={participant.user.fullName || participant.user.username || 'Avatar'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {participant.user?.fullName || participant.user?.username || 'Unknown user'}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {participant.user?.email}
                      </p>
                    </div>
                    {participant.level && (
                      <span className="text-muted-foreground text-xs capitalize">
                        {participant.level.toLowerCase().replace('_', ' ')}
                      </span>
                    )}
                    {!!participant.rank && (
                      <span className="text-muted-foreground text-xs">Rank #{participant.rank}</span>
                    )}
                    <span className="text-muted-foreground text-xs capitalize">
                      {participant.status.toLowerCase()}
                    </span>
                  </div>

                  <div className="mt-3 pl-12">
                    {isPhotosLoading ? (
                      <p className="text-muted-foreground text-xs">Loading photos...</p>
                    ) : photos.length ? (
                      <div className="flex flex-wrap gap-2">
                        {photos.map((photo, index) => (
                          <div
                            key={photo.contestPhotoId ?? photo.id ?? index}
                            className="group relative size-16 shrink-0 overflow-hidden rounded-md border"
                            title={photo.title ?? undefined}
                          >
                            {photo.url ? (
                              <Image src={photo.url} alt={photo.title || 'Submission'} fill className="object-cover" />
                            ) : (
                              <div className="bg-muted flex size-full items-center justify-center">
                                <ImageOff className="text-muted-foreground size-4" />
                              </div>
                            )}
                            {typeof photo.voteCount === 'number' && (
                              <span className="absolute right-0.5 bottom-0.5 flex items-center gap-0.5 rounded bg-black/70 px-1 py-0.5 text-[10px] font-medium text-white">
                                <Vote className="size-2.5" />
                                {photo.voteCount}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">No photos uploaded yet.</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground p-5 text-sm">No participants found.</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantsTab;
