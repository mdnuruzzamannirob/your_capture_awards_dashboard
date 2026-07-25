'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getAwardLabel } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import type { ContestAwardType } from '@/store/features/contest/types';
import { Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const tierAwardTypes = ['TOP_100', 'TOP_50', 'TOP_20', 'TOP_10'] as const;
const awardTypes = [
  'TOP_PHOTO',
  'TOP_PHOTOGRAPHER',
  'YC_PICK',
  ...tierAwardTypes,
] as const satisfies readonly ContestAwardType[];
const awardLabels: Record<(typeof awardTypes)[number], string> = {
  TOP_PHOTO: 'Top Photo',
  TOP_PHOTOGRAPHER: 'Top Photographer',
  YC_PICK: 'YC Pick',
  TOP_100: 'Top 100',
  TOP_50: 'Top 50',
  TOP_20: 'Top 20',
  TOP_10: 'Top 10',
};
const inputClass =
  'h-[39px] rounded-[9px] border-input bg-surface-secondary px-[11px] text-sm leading-[1.55] shadow-none focus-visible:border-primary focus-visible:ring-primary/20';
const labelClass =
  'text-xs font-extrabold tracking-[0.02em] text-label-foreground data-[error=true]:text-destructive';

function isTierAward(type: ContestAwardType) {
  return tierAwardTypes.includes(type as (typeof tierAwardTypes)[number]);
}

const RewardsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const { fields, append, remove } = useFieldArray({ name: 'awards', control: form.control });
  const awards = form.watch('awards');
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);

  const selectedTypes = useMemo(() => new Set(awards.map((award) => award.type)), [awards]);
  const hasTierAward = awards.some((award) => isTierAward(award.type));
  const canAdd = awardTypes.some(
    (type) => !selectedTypes.has(type) && (!isTierAward(type) || !hasTierAward),
  );
  const orderedFields = fields
    .map((award, index) => ({ award, index }))
    .sort((first, second) => {
      const firstIndex = awardTypes.indexOf(first.award.type as (typeof awardTypes)[number]);
      const secondIndex = awardTypes.indexOf(second.award.type as (typeof awardTypes)[number]);
      return (
        (firstIndex < 0 ? awardTypes.length : firstIndex) -
        (secondIndex < 0 ? awardTypes.length : secondIndex)
      );
    });

  function isAvailable(type: (typeof awardTypes)[number]) {
    if (selectedTypes.has(type)) return false;
    return !isTierAward(type) || !hasTierAward;
  }

  function addAward(type: (typeof awardTypes)[number]) {
    if (!isAvailable(type)) return;
    if (isTierAward(type)) {
      append([
        { type, recipient: 'Photo', boost: 0, key: 0, swap: 0, coin: 0 },
        { type, recipient: 'Photographer', boost: 0, key: 0, swap: 0, coin: 0 },
      ]);
    } else {
      append({ type, boost: 0, key: 0, swap: 0, coin: 0 });
    }
    setAwardDialogOpen(false);
  }

  function removeAward(index: number, type: ContestAwardType) {
    if (!isTierAward(type)) {
      remove(index);
      return;
    }

    remove(fields.flatMap((field, fieldIndex) => (field.type === type ? [fieldIndex] : [])));
  }

  return (
    <section
      className="border-border bg-surface overflow-hidden rounded-[14px] border"
      aria-labelledby="contest-awards-title"
    >
      <header className="border-border flex min-h-[62px] items-center justify-between gap-4 border-b px-[18px] py-3">
        <h2 id="contest-awards-title" className="text-heading text-sm font-extrabold">
          Awards
        </h2>
        <Button
          type="button"
          variant="outline"
          disabled={!canAdd}
          onClick={() => setAwardDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary h-9 rounded-[10px] px-3 text-[10px] font-bold shadow-none"
        >
          <Plus size={15} />
          Add award
        </Button>
      </header>

      <div className="grid gap-0 p-[18px]">
        {orderedFields.map(({ award, index }, visibleIndex) => {
          const label =
            award.type in awardLabels
              ? awardLabels[award.type as keyof typeof awardLabels]
              : getAwardLabel(award.type);
          const rowLabel = award.recipient ? `${label} — ${award.recipient}` : label;
          return (
            <article
              key={award.id}
              className={`grid gap-[14px] ${
                visibleIndex > 0 ? 'border-border border-t pt-[18px]' : ''
              } ${visibleIndex < orderedFields.length - 1 ? 'pb-[18px]' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-heading text-xs font-extrabold">{rowLabel}</strong>
                <button
                  type="button"
                  aria-label={`Remove ${rowLabel}`}
                  onClick={() => removeAward(index, award.type)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive grid size-[30px] place-items-center rounded-[7px] border-0 bg-transparent transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <input type="hidden" {...form.register(`awards.${index}.type`)} />
              {award.recipient && (
                <input type="hidden" {...form.register(`awards.${index}.recipient`)} />
              )}

              <div className="grid grid-cols-2 gap-2.5 min-[521px]:grid-cols-4">
                {(
                  [
                    ['boost', 'Boost'],
                    ['key', 'Key'],
                    ['swap', 'Swap'],
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

        {form.formState.errors.awards?.root?.message && (
          <p className="text-destructive mt-2 text-[9px]">
            {form.formState.errors.awards.root.message}
          </p>
        )}
        {typeof form.formState.errors.awards?.message === 'string' && (
          <p className="text-destructive mt-2 text-[9px]">{form.formState.errors.awards.message}</p>
        )}
      </div>

      <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          overlayClassName="bg-overlay/80 backdrop-blur-[5px]"
          className="border-border-strong bg-surface data-[state=open]:slide-in-from-bottom-3 max-h-[calc(100dvh-56px)] w-[min(500px,calc(100%-32px))] max-w-none gap-0 overflow-y-auto rounded-[20px] border p-0 shadow-[var(--shadow-modal)] max-[520px]:top-auto max-[520px]:bottom-0 max-[520px]:w-full max-[520px]:max-w-none max-[520px]:translate-y-0 max-[520px]:rounded-b-none"
        >
          <div className="border-border flex items-start justify-between gap-4 border-b px-[18px] py-4">
            <DialogTitle className="text-heading text-base font-extrabold">Add award</DialogTitle>
            <button
              type="button"
              aria-label="Close award picker"
              onClick={() => setAwardDialogOpen(false)}
              className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-9 place-items-center rounded-[10px] transition-colors"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid gap-5 p-[18px]">
            <div className="grid gap-2.5">
              <span className="text-label-foreground text-[10px] font-extrabold tracking-[0.06em] uppercase">
                Individual awards
              </span>
              <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
                {awardTypes
                  .filter((type) => !isTierAward(type))
                  .map((type) => (
                    <button
                      type="button"
                      key={type}
                      disabled={!isAvailable(type)}
                      onClick={() => addAward(type)}
                      className="border-input bg-surface-secondary text-body hover:border-primary hover:bg-primary-soft hover:text-primary-soft-foreground min-h-[39px] rounded-lg border px-2 text-[10px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-[0.38]"
                    >
                      {awardLabels[type]}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid gap-2.5">
              <div className="grid gap-0.5">
                <span className="text-label-foreground text-[10px] font-extrabold tracking-[0.06em] uppercase">
                  Top ranking awards
                </span>
                <small className="text-muted-foreground text-[10px]">
                  Selecting one adds both Photo and Photographer.
                </small>
              </div>
              <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
                {awardTypes
                  .filter((type) => isTierAward(type))
                  .map((type) => (
                    <button
                      type="button"
                      key={type}
                      disabled={!isAvailable(type)}
                      onClick={() => addAward(type)}
                      className="border-input bg-surface-secondary text-body hover:border-primary hover:bg-primary-soft hover:text-primary-soft-foreground min-h-[39px] rounded-lg border px-2 text-[10px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-[0.38]"
                    >
                      {awardLabels[type]}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RewardsStep;
