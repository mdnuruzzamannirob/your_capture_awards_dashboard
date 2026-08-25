'use client';

import type { Contest, ContestWinner } from '@/store/features/contest/types';

function getWinnerUserName(winner: ContestWinner) {
  return (
    winner.user?.fullName ||
    winner.participant?.user?.fullName ||
    [winner.user?.firstName, winner.user?.lastName].filter(Boolean).join(' ') ||
    [winner.participant?.user?.firstName, winner.participant?.user?.lastName]
      .filter(Boolean)
      .join(' ') ||
    'Unknown user'
  );
}

const WinnerTab = ({ contest }: { contest: Contest }) => {
  const winners = Array.isArray(contest?.winners)
    ? contest.winners
    : (contest?.winners?.data ?? []);

  return (
    <div className="w-full space-y-6">
      {winners.length ? (
        winners.map((winner: any, index: number) => (
          <div
            key={winner?.id ?? index}
            className="border-border-subtle bg-surface-secondary rounded-lg border p-5"
          >
            <h3 className="text-xl font-semibold">
              {winner?.category === 'TOP_PHOTOGRAPHER'
                ? 'Top Photographer Winner'
                : 'Top Photo Winner'}
            </h3>
            <p className="text-muted-foreground mt-2">{getWinnerUserName(winner)}</p>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground rounded-xl border p-5 text-sm">
          Winner data is not available in this contest response yet.
        </div>
      )}
    </div>
  );
};

export default WinnerTab;
