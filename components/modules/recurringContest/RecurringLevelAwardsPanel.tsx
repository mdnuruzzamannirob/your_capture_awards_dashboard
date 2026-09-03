'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetRecurringLevelAwardsQuery } from '@/store/features/recurringContest/recurringContestApi';
import { useState } from 'react';
import ConfigureRecurringLevelAwardsDialog from './ConfigureRecurringLevelAwardsDialog';

const tierName: Record<string, string> = {
  AMATEUR: 'Amateur',
  TALENTED: 'Talented',
  SUPREME: 'Supreme',
  SUPERIOR: 'Superior',
  TOP_NOTCH: 'Top Notch',
};

const RecurringLevelAwardsPanel = ({ id }: { id: string }) => {
  const { data, isLoading, isFetching } = useGetRecurringLevelAwardsQuery({ id });
  const [dialogOpen, setDialogOpen] = useState(false);
  const levelAwards = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-[13px]">
          Optional reward paid out to participants who reach a contest level, applied to every
          contest generated from this template.
        </p>
        <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
          Configure
        </Button>
      </div>

      <div className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
        {isLoading || isFetching ? (
          <p className="text-muted-foreground p-5 text-sm">Loading level awards...</p>
        ) : levelAwards.length ? (
          <ul className="divide-border-subtle divide-y">
            {levelAwards.map((award) => (
              <li key={award.level} className="flex items-center justify-between gap-4 px-4.5 py-3">
                <p className="text-sm font-medium">{tierName[award.level] ?? award.level}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">Charge {award.boost}</Badge>
                  <Badge variant="outline">Promote {award.key}</Badge>
                  <Badge variant="outline">Trade {award.swap}</Badge>
                  <Badge variant="outline">Coin {award.coin}</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground p-5 text-sm">
            Level awards are disabled for this template - reaching a level stays badge-only.
          </p>
        )}
      </div>

      <ConfigureRecurringLevelAwardsDialog
        id={id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentLevelAwards={levelAwards}
      />
    </div>
  );
};

export default RecurringLevelAwardsPanel;
