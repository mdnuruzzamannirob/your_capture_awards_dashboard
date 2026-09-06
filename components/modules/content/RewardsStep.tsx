'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getAwardLabel } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type { ContestAwardType } from '@/store/features/contest/types';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

// Every contest always awards Top Photo, Top Photographer, and the Top 10/20/50/100/200
// rank tiers (for both photo and photographer) automatically based on final ranking -
// admins only tune the reward payout per slot, they no longer opt tiers in or out.
const tierAwardTypes = ['TOP_10', 'TOP_20', 'TOP_50', 'TOP_100', 'TOP_200'] as const;
const awardTypes = [
  'TOP_PHOTO',
  'TOP_PHOTOGRAPHER',
  ...tierAwardTypes,
] as const satisfies readonly ContestAwardType[];
const awardLabels: Record<(typeof awardTypes)[number], string> = {
  TOP_PHOTO: 'Top Photo',
  TOP_PHOTOGRAPHER: 'Top Photographer',
  TOP_10: 'Top 10',
  TOP_20: 'Top 20',
  TOP_50: 'Top 50',
  TOP_100: 'Top 100',
  TOP_200: 'Top 200',
};
const rankBandHints: Partial<Record<(typeof awardTypes)[number], string>> = {
  TOP_10: 'Ranks 2–10',
  TOP_20: 'Ranks 11–20',
  TOP_50: 'Ranks 21–50',
  TOP_100: 'Ranks 51–100',
  TOP_200: 'Ranks 101–200',
};
const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';

function isTierAward(type: ContestAwardType) {
  return tierAwardTypes.includes(type as (typeof tierAwardTypes)[number]);
}

function slotOrder(type: ContestAwardType) {
  const index = awardTypes.indexOf(type as (typeof awardTypes)[number]);
  return index < 0 ? awardTypes.length : index;
}

const RewardsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const { fields, append } = useFieldArray({ name: 'awards', control: form.control });
  const awards = form.watch('awards');

  // Guarantee all 12 fixed slots exist (Top Photo, Top Photographer, and each rank tier
  // paired for Photo + Photographer) even if the contest predates this ladder or the
  // creation-options prize catalog hasn't loaded yet.
  useEffect(() => {
    const present = new Set(
      awards.map((award) => `${award.type}:${award.recipient ?? ''}`),
    );
    const missing: ContestFinalValues['awards'] = [];

    awardTypes.forEach((type) => {
      if (isTierAward(type)) {
        (['Photo', 'Photographer'] as const).forEach((recipient) => {
          if (!present.has(`${type}:${recipient}`)) {
            missing.push({ type, recipient, boost: 0, key: 0, swap: 0, coin: 0 });
          }
        });
      } else if (!present.has(`${type}:`)) {
        missing.push({ type, boost: 0, key: 0, swap: 0, coin: 0 });
      }
    });

    if (missing.length) {
      append(missing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awards.length]);

  // Top 10-200 tiers are badge-only (enforced server-side too) - force their reward
  // fields to 0 even if a stale/cached contest still has old nonzero values loaded.
  useEffect(() => {
    awards.forEach((award, index) => {
      if (!isTierAward(award.type)) return;
      (['boost', 'key', 'swap', 'coin'] as const).forEach((field) => {
        if (Number(award[field]) !== 0) {
          form.setValue(`awards.${index}.${field}`, 0);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awards]);

  const orderedFields = fields
    .map((award, index) => ({ award, index }))
    .sort((first, second) => slotOrder(first.award.type) - slotOrder(second.award.type));

  // Tier slots (Top 10-200) are always badge-only with nothing to configure, so they
  // stay registered (still submitted as part of `awards`, so finalization keeps
  // awarding those badges) but are never rendered as a visible row.
  const visibleFields = orderedFields.filter(({ award }) => !isTierAward(award.type));
  const hiddenTierFields = orderedFields.filter(({ award }) => isTierAward(award.type));

  return (
    <section
      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border"
      aria-labelledby="contest-awards-title"
    >
      <header className="border-border-subtle flex min-h-13 flex-col gap-1 border-b bg-[var(--bg-inset)] px-[18px] py-3">
        <h2 id="contest-awards-title" className="text-heading text-sm font-extrabold">
          Awards
        </h2>
        <p className="text-muted-foreground text-[11px]">
          Awarded automatically from the final ranking. Set the reward payout for Top Photo and
          Top Photographer below. Top 10 through Top 200 are always badge-only (no promote,
          trade, charge, or coin reward) and aren&apos;t configurable here.
        </p>
      </header>

      <div className="grid gap-0 p-[18px]">
        {visibleFields.map(({ award, index }, visibleIndex) => {
          const label =
            award.type in awardLabels
              ? awardLabels[award.type as keyof typeof awardLabels]
              : getAwardLabel(award.type);
          const rowLabel = award.recipient ? `${label} — ${award.recipient}` : label;
          const hint = rankBandHints[award.type as keyof typeof rankBandHints];
          return (
            <article
              key={award.id}
              className={`grid gap-[14px] ${
                visibleIndex > 0 ? 'border-border border-t pt-[18px]' : ''
              } ${visibleIndex < visibleFields.length - 1 ? 'pb-[18px]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <strong className="text-heading text-xs font-extrabold">{rowLabel}</strong>
                  {hint && (
                    <span className="text-muted-foreground ml-2 text-[10px]">{hint}</span>
                  )}
                </div>
              </div>

              <input type="hidden" {...form.register(`awards.${index}.type`)} />
              {award.recipient && (
                <input type="hidden" {...form.register(`awards.${index}.recipient`)} />
              )}

              <div className="grid grid-cols-2 items-start gap-2.5 min-[521px]:grid-cols-4">
                {(
                  [
                    ['boost', 'Promote'],
                    ['key', 'Charge'],
                    ['swap', 'Trade'],
                    ['coin', 'Coin'],
                  ] as const
                ).map(([key, fieldLabel]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`awards.${index}.${key}`}
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel className={labelClass}>{fieldLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className={inputClass}
                            {...field}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        </FormControl>
                        <FormMessage className="text-[9px]" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </article>
          );
        })}

        {/* Tier slots (Top 10-200) stay registered so they're still submitted with the
            contest (finalization keeps granting those badges) but render nothing. */}
        {hiddenTierFields.map(({ award, index }) => (
          <div key={award.id} hidden>
            <input type="hidden" {...form.register(`awards.${index}.type`)} />
            {award.recipient && (
              <input type="hidden" {...form.register(`awards.${index}.recipient`)} />
            )}
            {(['boost', 'key', 'swap', 'coin'] as const).map((field) => (
              <input key={field} type="hidden" {...form.register(`awards.${index}.${field}`)} />
            ))}
          </div>
        ))}

        {form.formState.errors.awards?.root?.message && (
          <p className="text-destructive mt-2 text-[9px]">
            {form.formState.errors.awards.root.message}
          </p>
        )}
        {typeof form.formState.errors.awards?.message === 'string' && (
          <p className="text-destructive mt-2 text-[9px]">{form.formState.errors.awards.message}</p>
        )}
      </div>
    </section>
  );
};

export default RewardsStep;
