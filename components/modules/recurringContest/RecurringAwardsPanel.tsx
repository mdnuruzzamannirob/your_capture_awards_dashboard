'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAwardLabel } from '@/lib/contest';
import { useGetRecurringAwardsQuery } from '@/store/features/recurringContest/recurringContestApi';
import { useState } from 'react';
import ReplaceRecurringAwardsDialog from './ReplaceRecurringAwardsDialog';

const RecurringAwardsPanel = ({ id }: { id: string }) => {
  const { data, isLoading, isFetching } = useGetRecurringAwardsQuery({ id });
  const [dialogOpen, setDialogOpen] = useState(false);
  const awards = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-[13px]">
          Awards applied to every contest generated from this template.
        </p>
        <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
          Replace awards
        </Button>
      </div>

      <div className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
        {isLoading || isFetching ? (
          <p className="text-muted-foreground p-5 text-sm">Loading awards...</p>
        ) : awards.length ? (
          <ul className="divide-border-subtle divide-y">
            {awards.map((award) => (
              <li key={award.id} className="flex items-center justify-between gap-4 px-4.5 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {award.title || getAwardLabel(award.category)}
                  </p>
                  {award.target && (
                    <p className="text-muted-foreground text-xs capitalize">
                      {award.target.toLowerCase()}
                    </p>
                  )}
                </div>
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
          <p className="text-muted-foreground p-5 text-sm">No awards configured yet.</p>
        )}
      </div>

      <ReplaceRecurringAwardsDialog
        id={id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentAwards={awards}
      />
    </div>
  );
};

export default RecurringAwardsPanel;
