'use client';

const WinnerTab = ({ contest }: { contest: any }) => {
  const winners = contest?.winners?.data ?? contest?.winners ?? [];

  return (
    <div className="w-full space-y-6">
      {winners.length ? (
        winners.map((winner: any, index: number) => (
          <div key={winner?.id ?? index} className="rounded-2xl border p-5">
            <h3 className="text-xl font-semibold">
              {winner?.category === 'TOP_PHOTOGRAPHER' ? 'Top Photographer Winner' : 'Top Photo Winner'}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {winner?.participant?.user?.fullName ?? 'Unknown user'}
            </p>
          </div>
        ))
      ) : (
        <div className="rounded-xl border p-5 text-sm text-muted-foreground">
          Winner data is not available in this contest response yet.
        </div>
      )}
    </div>
  );
};

export default WinnerTab;
