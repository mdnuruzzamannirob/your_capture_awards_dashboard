'use client';

const WinnerTab = ({ contest }: { contest: any }) => {
  const winners = contest?.winners?.data ?? contest?.winners ?? [];

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
            <p className="text-muted-foreground mt-2">
              {winner?.participant?.user?.fullName ?? 'Unknown user'}
            </p>
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
