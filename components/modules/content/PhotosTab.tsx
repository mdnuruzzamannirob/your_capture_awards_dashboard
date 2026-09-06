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
import { Textarea } from '@/components/ui/textarea';
import {
  useAdminDeleteContestPhotoMutation,
  useGetContestRankPhotosQuery,
} from '@/store/features/contest/contestApi';
import type { Contest, RankedPhoto } from '@/store/features/contest/types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;
  if ('data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
};

const PhotosTab = ({ contest }: { contest: Contest }) => {
  const [photoToRemove, setPhotoToRemove] = useState<RankedPhoto | null>(null);
  const [reason, setReason] = useState('');

  const { data, isLoading, isFetching } = useGetContestRankPhotosQuery({ id: contest.id, limit: 100 });
  const [adminDeletePhoto, { isLoading: isDeleting }] = useAdminDeleteContestPhotoMutation();

  const photos = data?.data?.photos ?? [];

  const handleRemove = async () => {
    if (!photoToRemove?.contestPhotoId) return;
    try {
      const response = await adminDeletePhoto({
        photoId: photoToRemove.contestPhotoId,
        contestId: contest.id,
        reason: reason.trim() || undefined,
      }).unwrap();
      toast.success(response.message || 'Photo removed successfully.');
      setPhotoToRemove(null);
      setReason('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove photo.'));
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-border-subtle bg-surface-secondary rounded-lg border p-5">
        {isLoading || isFetching ? (
          <p className="text-muted-foreground text-sm">Loading submitted photos...</p>
        ) : photos.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.contestPhotoId ?? photo.id ?? index}
                className="border-border-subtle group relative overflow-hidden rounded-lg border"
              >
                <div className="bg-muted relative aspect-square w-full">
                  {photo.url && (
                    <Image
                      src={photo.url}
                      alt={photo.title || 'Contest submission'}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {photo.photographer?.fullName || 'Unknown photographer'}
                    </p>
                    {typeof photo.voteCount === 'number' && (
                      <p className="text-muted-foreground text-[11px]">{photo.voteCount} votes</p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => setPhotoToRemove(photo)}
                    title="Remove photo"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No photos submitted yet.</p>
        )}
      </div>

      <AlertDialog open={!!photoToRemove} onOpenChange={(open) => !open && setPhotoToRemove(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              The photo will be permanently removed from the contest and the owner will be
              notified by email. This does not block their account — banning is a separate action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason (optional, included in the email to the owner)"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} disabled={isDeleting}>
              {isDeleting ? 'Removing...' : 'Remove Photo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PhotosTab;
