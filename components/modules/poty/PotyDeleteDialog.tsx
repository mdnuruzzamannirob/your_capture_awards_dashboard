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
import { Input } from '@/components/ui/input';
import {
  useDeleteContestMutation,
  useGetPotyAdminOverviewQuery,
} from '@/store/features/contest/contestApi';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from './potyUi';

const CONFIRM_WORD = 'DELETE';

// Permanent deletion of a Photographer of the Year contest, at any stage. The
// counts come from the admin overview (already cached on the POTY page).
const PotyDeleteDialog = ({
  contestId,
  title,
  open,
  onOpenChange,
  onDeleted,
}: {
  contestId: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) => {
  const [deleteContest, { isLoading: isDeleting }] = useDeleteContestMutation();
  const { data } = useGetPotyAdminOverviewQuery(undefined, { skip: !open });
  const stats = data?.data?.contests.find((contest) => contest.id === contestId);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!open) setTyped('');
  }, [open]);

  const handleDelete = async () => {
    try {
      await deleteContest({ id: contestId }).unwrap();
      toast.success(`“${title}” and all its data were deleted.`);
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete the contest.'));
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!isDeleting) onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently delete “{title}”?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>
                This removes the contest and everything attached to it from the database, whatever
                stage it is in. It cannot be undone.
              </p>
              <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                <li>
                  {stats
                    ? `${stats.entryCount} ${stats.entryCount === 1 ? 'entry' : 'entries'} from ${stats.participantCount} ${stats.participantCount === 1 ? 'photographer' : 'photographers'}`
                    : 'All entries and participants'}
                  , with their votes, comments and reports
                </li>
                <li>Rankings, published results, rules and related notifications</li>
                <li>The contest banner file</li>
              </ul>
              <p className="text-muted-foreground">
                Photographers keep the photos in their own galleries. Payment records are kept for
                the Wallet ledger.
              </p>
              {stats?.paidEntryCount ? (
                <p className="border-warning/40 bg-warning-subtle text-foreground flex items-start gap-2 rounded-md border p-2.5">
                  <AlertTriangle className="text-warning mt-0.5 size-4 shrink-0" />
                  {stats.paidEntryCount} {stats.paidEntryCount === 1 ? 'entry was' : 'entries were'}{' '}
                  paid. Deleting does not refund them; refund from the Wallet page if needed.
                </p>
              ) : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <label htmlFor="poty-delete-confirm" className="text-xs font-medium">
            Type <span className="text-destructive font-bold">{CONFIRM_WORD}</span> to confirm
          </label>
          <Input
            id="poty-delete-confirm"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            disabled={isDeleting}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={isDeleting || typed.trim() !== CONFIRM_WORD}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Deleting…
              </>
            ) : (
              'Delete permanently'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PotyDeleteDialog;
