'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { CONTEST_AWARD_OPTIONS } from '@/lib/constants';
import { getAwardLabel } from '@/lib/contest';
import type { Contest } from '@/store/features/contest/types';

const PrizesTab = ({ contest }: { contest: Contest }) => {
  const awards = contest.prizes?.length ? contest.prizes : (contest.awards ?? []);

  return (
    <div className="space-y-5">
      <div className="border-border bg-surface grid gap-4 rounded-xl border p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-sm">Money contest</p>
          <p className="mt-1 font-semibold">{contest.isMoneyContest ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Prize range</p>
          <p className="mt-1 font-semibold">
            {contest.isMoneyContest
              ? `${contest.minPrize ?? 0} – ${contest.maxPrize ?? 0}`
              : 'Not applicable'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Entry coins</p>
          <p className="mt-1 font-semibold">
            {contest.coin_requirement ? (contest.coin_required ?? 0) : 'Not required'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Configured awards</p>
          <p className="mt-1 font-semibold">{awards.length}</p>
        </div>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2">
        {awards.map((award, index) => {
          const category = award.category ?? award.type ?? award.prize?.category;
          const option = CONTEST_AWARD_OPTIONS.find((item) => item.value === category);
          return (
            <article
              key={award.id ?? `${category}-${index}`}
              className="border-border bg-surface rounded-xl border p-5"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <DynamicIcon
                    name={award.icon ?? award.prize?.icon ?? option?.icon ?? 'Award'}
                    className="text-primary size-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {award.title ?? award.prize?.title ?? option?.label ?? getAwardLabel(category)}
                  </h3>
                  {(award.description ?? award.prize?.description) && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {award.description ?? award.prize?.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[
                  ['Boost', award.boost],
                  ['Key', award.key],
                  ['Swap', award.swap],
                  ['Coin', award.coin],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-surface-tertiary rounded-lg px-2 py-3">
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="mt-1 font-semibold">{Number(value ?? 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {!awards.length && (
        <p className="text-muted-foreground rounded-xl border p-5 text-sm">
          No awards configured for this contest.
        </p>
      )}
    </div>
  );
};

export default PrizesTab;
