'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getApiErrorMessage } from '@/lib/recurringContest';
import { useGetContestCreationOptionsQuery } from '@/store/features/contest/contestApi';
import { useReplaceRecurringAwardsMutation } from '@/store/features/recurringContest/recurringContestApi';
import type { RecurringContestAward } from '@/store/features/recurringContest/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ReplaceRecurringAwardsDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAwards: RecurringContestAward[];
};

const ReplaceRecurringAwardsDialog = ({
  id,
  open,
  onOpenChange,
  currentAwards,
}: ReplaceRecurringAwardsDialogProps) => {
  const { data: optionsData, isLoading: isOptionsLoading } = useGetContestCreationOptionsQuery(
    undefined,
    { skip: !open },
  );
  const [replaceAwards, { isLoading: isSaving }] = useReplaceRecurringAwardsMutation();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const prizeDefinitions = (
    optionsData?.data?.prizeDefinitions?.length
      ? optionsData.data.prizeDefinitions
      : (optionsData?.data?.prizes ?? [])
  ).filter((prize) => prize.type !== 'YC_PICK');

  useEffect(() => {
    if (!open) return;
    setSelected(new Set(currentAwards.map((award) => award.prizeId)));
  }, [open, currentAwards]);

  const toggle = (prizeId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(prizeId)) next.delete(prizeId);
      else next.add(prizeId);
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      await replaceAwards({ id, body: { awardPrizeIds: Array.from(selected) } }).unwrap();
      toast.success('Awards updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-56px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Replace awards</DialogTitle>
          <DialogDescription>
            Choose which default awards apply to every contest generated from this template. This
            replaces the current award list.
          </DialogDescription>
        </DialogHeader>

        {isOptionsLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
            <Loader2 className="size-4 animate-spin" /> Loading available awards...
          </div>
        ) : (
          <div className="grid gap-2">
            {prizeDefinitions.map((prize) => (
              <label
                key={prize.prizeId}
                className="border-border-subtle bg-surface-secondary flex items-center gap-2.5 rounded-md border px-3 py-2 text-[13px]"
              >
                <Checkbox
                  checked={selected.has(prize.prizeId)}
                  onCheckedChange={() => toggle(prize.prizeId)}
                />
                <span className="flex-1">{prize.title}</span>
              </label>
            ))}
            {!prizeDefinitions.length && (
              <p className="text-muted-foreground text-sm">No award definitions available.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={isSaving || isOptionsLoading} onClick={handleSubmit}>
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Saving...
              </span>
            ) : (
              'Save awards'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplaceRecurringAwardsDialog;
