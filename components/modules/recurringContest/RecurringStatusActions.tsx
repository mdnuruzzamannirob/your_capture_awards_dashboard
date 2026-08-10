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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getApiErrorMessage } from '@/lib/recurringContest';
import {
  useEndRecurringContestMutation,
  usePauseRecurringContestMutation,
  useResumeRecurringContestMutation,
} from '@/store/features/recurringContest/recurringContestApi';
import type { RecurringContestStatus } from '@/store/features/recurringContest/types';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type RecurringStatusActionsProps = {
  id: string;
  status: RecurringContestStatus;
};

const RecurringStatusActions = ({ id, status }: RecurringStatusActionsProps) => {
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [pauseRecurring, { isLoading: isPausing }] = usePauseRecurringContestMutation();
  const [resumeRecurring, { isLoading: isResuming }] = useResumeRecurringContestMutation();
  const [endRecurring, { isLoading: isEnding }] = useEndRecurringContestMutation();

  const isBusy = isPausing || isResuming || isEnding;

  const handlePause = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await pauseRecurring({ id }).unwrap();
      toast.success('Recurring contest paused');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleResume = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await resumeRecurring({ id }).unwrap();
      toast.success('Recurring contest resumed');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleEnd = async () => {
    try {
      await endRecurring({ id }).unwrap();
      toast.success('Recurring contest ended');
      setEndDialogOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (status === 'ENDED') {
    return <span className="text-muted-foreground text-xs">No actions</span>;
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isBusy}
            aria-label="Recurring contest actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === 'ACTIVE' && (
            <DropdownMenuItem onClick={handlePause} disabled={isBusy}>
              Pause
            </DropdownMenuItem>
          )}
          {status === 'PAUSED' && (
            <DropdownMenuItem onClick={handleResume} disabled={isBusy}>
              Resume
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            disabled={isBusy}
            onClick={(event) => {
              event.stopPropagation();
              setEndDialogOpen(true);
            }}
          >
            End
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this recurring contest?</AlertDialogTitle>
            <AlertDialogDescription>
              This stops future contests from being generated. Contests already generated are not
              affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isEnding}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleEnd();
              }}
              disabled={isEnding}
            >
              {isEnding ? 'Ending…' : 'End recurring contest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecurringStatusActions;
