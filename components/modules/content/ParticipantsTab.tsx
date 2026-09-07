'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  useGetContestParticipantsQuery,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import type { Contest, RankedPhoto } from '@/store/features/contest/types';
import { ImageOff, Search, Trophy, Users, Vote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const formatLevel = (level: string) =>
  level
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ParticipantRowSkeleton = () => (
  <div className="border-border-subtle bg-surface-secondary rounded-xl border p-4">
    <div className="flex items-center gap-3">
      <div className="bg-surface-tertiary size-11 shrink-0 animate-pulse rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="bg-surface-tertiary h-3.5 w-40 animate-pulse rounded" />
        <div className="bg-surface-tertiary h-3 w-56 animate-pulse rounded" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-surface-tertiary size-20 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

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

  const totalPhotos = photosData?.data?.photos?.length ?? 0;
  const isBusy = isLoading || isFetching;

  return (
    <div className="w-full space-y-5">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Users className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold">Participants</h3>
            <p className="text-muted-foreground text-xs">
              {isBusy
                ? 'Loading entries...'
                : `${participants.length} photographer${participants.length === 1 ? '' : 's'} · ${totalPhotos} photo${totalPhotos === 1 ? '' : 's'} submitted`}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name or username"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="h-9 rounded-lg pl-9"
          />
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────────── */}
      {isBusy ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ParticipantRowSkeleton key={index} />
          ))}
        </div>
      ) : participants.length ? (
        <div className="space-y-3">
          {participants.map((participant) => {
            const photos = participant.user?.id
              ? (photosByUserId.get(participant.user.id) ?? [])
              : [];
            const displayName =
              participant.user?.fullName || participant.user?.username || 'Unknown user';
            const isActive = participant.status?.toUpperCase() === 'ACTIVE';

            return (
              <article
                key={participant.id}
                className="border-border-subtle bg-surface-secondary hover:border-border-default rounded-xl border p-4 transition-colors"
              >
                <header className="flex flex-wrap items-center gap-3">
                  <div className="bg-surface-tertiary relative size-11 shrink-0 overflow-hidden rounded-full">
                    {participant.user?.avatar ? (
                      <Image
                        src={participant.user.avatar}
                        alt={displayName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground flex size-full items-center justify-center text-sm font-semibold">
                        {displayName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    {participant.user?.email && (
                      <p className="text-muted-foreground truncate text-xs">
                        {participant.user.email}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    {!!participant.rank && (
                      <Badge variant="outline">
                        <Trophy /> Rank #{participant.rank}
                      </Badge>
                    )}
                    {participant.level && (
                      <Badge variant={participant.level === 'NEW' ? 'outline' : 'default'}>
                        {formatLevel(participant.level)}
                      </Badge>
                    )}
                    <Badge variant={isActive ? 'secondary' : 'destructive'}>
                      {participant.status
                        ? participant.status.charAt(0) + participant.status.slice(1).toLowerCase()
                        : 'Unknown'}
                    </Badge>
                  </div>
                </header>

                <div className="border-border-subtle mt-3.5 border-t pt-3.5">
                  {isPhotosLoading ? (
                    <div className="flex gap-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="bg-surface-tertiary size-20 animate-pulse rounded-lg"
                        />
                      ))}
                    </div>
                  ) : photos.length ? (
                    <>
                      <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wide uppercase">
                        {photos.length} photo{photos.length === 1 ? '' : 's'} submitted
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {photos.map((photo, index) => (
                          <div
                            key={photo.contestPhotoId ?? photo.id ?? index}
                            className={cn(
                              'border-border-subtle group relative size-20 shrink-0 overflow-hidden rounded-lg border',
                              'transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md',
                            )}
                          >
                            {photo.url ? (
                              <Image
                                src={photo.url}
                                alt={photo.title || `${displayName} submission`}
                                fill
                                unoptimized
                                sizes="80px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="bg-surface-tertiary flex size-full items-center justify-center">
                                <ImageOff className="text-muted-foreground size-4" />
                              </div>
                            )}
                            {typeof photo.voteCount === 'number' && (
                              <span className="absolute right-1 bottom-1 flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                                <Vote className="size-2.5" />
                                {photo.voteCount}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <ImageOff className="size-3.5" />
                      No photos submitted yet
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border-border-subtle bg-surface-secondary flex flex-col items-center justify-center gap-2 rounded-xl border py-16 text-center">
          <Users className="text-muted-foreground size-9" />
          <p className="text-sm font-medium">
            {search ? 'No participants match your search' : 'No participants yet'}
          </p>
          <p className="text-muted-foreground text-xs">
            {search
              ? 'Try a different name or username.'
              : 'Photographers will appear here once they join this contest.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticipantsTab;
