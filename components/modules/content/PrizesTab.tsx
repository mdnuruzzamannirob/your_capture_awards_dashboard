'use client';

import DynamicIcon from '@/components/common/DynamicIcon';
import { Badge } from '@/components/ui/badge';
import { CONTEST_AWARD_OPTIONS } from '@/lib/constants';
import { getAwardLabel } from '@/lib/contest';
import type { Contest } from '@/store/features/contest/types';

const levelName: Record<string, string> = {
  AMATEUR: 'Amateur',
  TALENTED: 'Talented',
  SUPREME: 'Supreme',
  SUPERIOR: 'Superior',
  TOP_NOTCH: 'Top Notch',
};

const tierAwardTypes = ['TOP_10', 'TOP_20', 'TOP_50', 'TOP_100', 'TOP_200'];

// Top 10-200 tiers are always badge-only (no promote/trade/charge/coin) - not worth
// showing here since there's never anything configured for them to display.
function isTierAward(award: { type?: string | null; rankLimit?: number | null }) {
  return (
    award.type === 'TOP_RANK' ||
    award.rankLimit != null ||
    tierAwardTypes.includes(award.type ?? '')
  );
}

const PrizesTab = ({ contest }: { contest: Contest }) => {
  const allAwards = contest.prizes?.length ? contest.prizes : (contest.awards ?? []);
  const awards = allAwards.filter((award) => !isTierAward(award));
  const levelAwards = contest.levelAwards ?? [];

  return (
    <div className="space-y-5">
      <div className="border-border-subtle bg-surface-secondary grid gap-4 rounded-lg border p-5 sm:grid-cols-2 lg:grid-cols-4">
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
              className="border-border-subtle bg-surface-secondary rounded-lg border p-5"
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
                  ['Promote', award.boost],
                  ['Charge', award.key],
                  ['Trade', award.swap],
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

      <div className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border">
        <div className="border-border-subtle border-b px-5 py-3">
          <h3 className="text-sm font-semibold">Contest level awards</h3>
          <p className="text-muted-foreground text-xs">
            Optional reward paid out to participants who reach a contest level at finalization.
          </p>
        </div>
        {levelAwards.length ? (
          <ul className="divide-border-subtle divide-y">
            {levelAwards.map((award) => (
              <li key={award.level} className="flex items-center justify-between gap-4 px-5 py-3">
                <p className="text-sm font-medium">{levelName[award.level] ?? award.level}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">Promote {award.boost}</Badge>
                  <Badge variant="outline">Charge {award.key}</Badge>
                  <Badge variant="outline">Trade {award.swap}</Badge>
                  <Badge variant="outline">Coin {award.coin}</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground p-5 text-sm">
            Level awards are disabled - reaching a level in this contest stays badge-only.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrizesTab;
