'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { getApiErrorMessage } from '@/lib/recurringContest';
import { useReplaceRecurringLevelAwardsMutation } from '@/store/features/recurringContest/recurringContestApi';
import type { RecurringContestLevelAward } from '@/store/features/recurringContest/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ConfigureRecurringLevelAwardsDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLevelAwards: RecurringContestLevelAward[];
};

const LEVELS = ['AMATEUR', 'TALENTED', 'SUPREME', 'SUPERIOR', 'TOP_NOTCH'] as const;

const tierName: Record<string, string> = {
  AMATEUR: 'Amateur',
  TALENTED: 'Talented',
  SUPREME: 'Supreme',
  SUPERIOR: 'Superior',
  TOP_NOTCH: 'Top Notch',
};

const rewardFieldLabels: Record<'boost' | 'key' | 'swap' | 'coin', string> = {
  boost: 'Charge',
  key: 'Promote',
  swap: 'Trade',
  coin: 'Coin',
};

type RewardFields = { boost: number; swap: number; key: number; coin: number };
type RewardsByLevel = Record<(typeof LEVELS)[number], RewardFields>;

const emptyRewards = (): RewardsByLevel =>
  Object.fromEntries(LEVELS.map((level) => [level, { boost: 0, swap: 0, key: 0, coin: 0 }])) as RewardsByLevel;

const ConfigureRecurringLevelAwardsDialog = ({
  id,
  open,
  onOpenChange,
  currentLevelAwards,
}: ConfigureRecurringLevelAwardsDialogProps) => {
  const [replaceLevelAwards, { isLoading: isSaving }] = useReplaceRecurringLevelAwardsMutation();
  const [enabled, setEnabled] = useState(false);
  const [rewards, setRewards] = useState<RewardsByLevel>(emptyRewards());

  useEffect(() => {
    if (!open) return;

    if (currentLevelAwards.length) {
      setEnabled(true);
      setRewards({
        ...emptyRewards(),
        ...Object.fromEntries(
          currentLevelAwards.map((award) => [
            award.level,
            { boost: award.boost, swap: award.swap, key: award.key, coin: award.coin },
          ]),
        ),
      });
    } else {
      setEnabled(false);
      setRewards(emptyRewards());
    }
  }, [open, currentLevelAwards]);

  const updateReward = (level: (typeof LEVELS)[number], field: keyof RewardFields, value: string) => {
    const parsed = Math.max(0, Number(value) || 0);
    setRewards((prev) => ({ ...prev, [level]: { ...prev[level], [field]: parsed } }));
  };

  const handleSubmit = async () => {
    try {
      await replaceLevelAwards({
        id,
        body: {
          levelAwards: enabled ? LEVELS.map((level) => ({ level, ...rewards[level] })) : [],
        },
      }).unwrap();
      toast.success(enabled ? 'Level awards updated' : 'Level awards disabled');
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-56px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contest level awards</DialogTitle>
          <DialogDescription>
            Optional. Once enabled, every level from Amateur through Top Notch must be configured -
            this replaces the current level award setup for this template.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
          <span className="text-sm font-medium">Enable level awards</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable level awards" />
        </div>

        {enabled && (
          <div className="grid gap-3.5">
            {LEVELS.map((level) => (
              <div key={level} className="grid gap-2 border-t pt-3 first:border-t-0 first:pt-0">
                <span className="text-sm font-semibold">{tierName[level]}</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['boost', 'key', 'swap', 'coin'] as const).map((field) => (
                    <label key={field} className="grid gap-1 text-xs">
                      <span className="text-muted-foreground">{rewardFieldLabels[field]}</span>
                      <Input
                        type="number"
                        min={0}
                        value={rewards[level][field]}
                        onChange={(event) => updateReward(level, field, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={isSaving} onClick={handleSubmit}>
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Saving...
              </span>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureRecurringLevelAwardsDialog;
