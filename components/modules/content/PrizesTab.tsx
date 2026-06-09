'use client';

const PrizesTab = ({ contest }: { contest: any }) => {
  const prizes = contest?.prizes ?? [];

  return (
    <div className="w-full space-y-10">
      {contest?.isMoneyContest ? (
        <div className="space-y-5 rounded-xl border p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-muted-foreground font-medium">Min Prize</h3>
              <p className="text-2xl font-semibold">{contest?.minPrize ?? 0}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-muted-foreground font-medium">Max Prize</h3>
              <p className="text-2xl font-semibold">{contest?.maxPrize ?? 0}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="flex h-40 items-center justify-center text-center text-muted-foreground">
          This contest is currently a non-monetary competition.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {prizes.map((prize: any, index: number) => (
          <div key={index} className="rounded-xl border p-5">
            <h3 className="text-lg font-semibold">
              {prize?.category === 'TOP_PHOTO' ? 'Top Photo Award' : 'Top Photographer Award'}
            </h3>
            <div className="mt-4 flex items-center gap-5 text-sm">
              <div className="space-y-1">
                <h4 className="text-muted-foreground font-medium">Swap</h4>
                <p className="text-base font-semibold">{prize?.swap ?? prize?.trades ?? 0}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-muted-foreground font-medium">Boost</h4>
                <p className="text-base font-semibold">{prize?.boost ?? prize?.charges ?? 0}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-muted-foreground font-medium">Key</h4>
                <p className="text-base font-semibold">{prize?.key ?? prize?.keys ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizesTab;
