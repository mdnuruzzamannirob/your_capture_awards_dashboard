'use client';

import { cn } from '@/lib/utils';
import type { PotyStage } from '@/store/features/contest/types';
import { CalendarClock, Check, Gavel, Trophy, Upload, type LucideIcon } from 'lucide-react';

// What each stage means to an admin, and the one thing they usually do next.
export const STAGE_META: Record<
  PotyStage,
  { label: string; hint: string; icon: LucideIcon; badgeClass: string; dotClass: string }
> = {
  SCHEDULED: {
    label: 'Scheduled',
    hint: 'Not open yet. Everything can still be edited.',
    icon: CalendarClock,
    badgeClass: 'bg-info-subtle text-info',
    dotClass: 'bg-info',
  },
  RUNNING: {
    label: 'Accepting entries',
    hint: 'Photographers are entering. Rankings update as votes come in.',
    icon: Upload,
    badgeClass: 'bg-success-subtle text-success',
    dotClass: 'bg-success',
  },
  JUDGING: {
    label: 'Awaiting judging',
    hint: 'Entries are closed. Choose the winners from the top 10 and publish.',
    icon: Gavel,
    badgeClass: 'bg-warning-subtle text-warning',
    dotClass: 'bg-warning',
  },
  PUBLISHED: {
    label: 'Results published',
    hint: 'Winners have been announced and notified.',
    icon: Trophy,
    badgeClass: 'bg-primary-soft text-primary',
    dotClass: 'bg-primary',
  },
};

export const STAGE_ORDER: PotyStage[] = ['SCHEDULED', 'RUNNING', 'JUDGING', 'PUBLISHED'];

// Contests that need the admin come first in lists.
export const STAGE_PRIORITY: Record<PotyStage, number> = {
  JUDGING: 0,
  RUNNING: 1,
  SCHEDULED: 2,
  PUBLISHED: 3,
};

export const formatMoney = (value?: number | null, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value ?? 0));

export const formatDate = (value?: string | null, withTime = false) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

// "in 3 days", "2 hours ago" - coarse on purpose, it is only a cue.
export const formatRelative = (value?: string | null) => {
  if (!value) return '';
  const diffMs = new Date(value).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];
  const [unit, size] = units.find(([, ms]) => abs >= ms) ?? ['minute', 60_000];
  return new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' }).format(
    Math.round(diffMs / size),
    unit,
  );
};

export const placeLabel = (index: number) => {
  const n = index + 1;
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? 'th'
      : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] || 'th';
  return `${n}${suffix}`;
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;
  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }
  return fallback;
};

export const StageBadge = ({ stage, className }: { stage: PotyStage; className?: string }) => {
  const meta = STAGE_META[stage];
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        meta.badgeClass,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dotClass)} />
      {meta.label}
    </span>
  );
};

// Four-step progress line: done steps get a check, the current one is filled.
export const StageTracker = ({ stage, className }: { stage: PotyStage; className?: string }) => {
  const current = STAGE_ORDER.indexOf(stage);
  return (
    <ol className={cn('flex items-center gap-1.5', className)} aria-label="Contest progress">
      {STAGE_ORDER.map((step, index) => {
        const done = index < current || stage === 'PUBLISHED';
        const active = index === current && stage !== 'PUBLISHED';
        const Icon = STAGE_META[step].icon;
        return (
          <li key={step} className="flex min-w-0 flex-1 items-center gap-1.5">
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary bg-primary-soft text-primary',
                !done && !active && 'border-border-subtle text-muted-foreground',
              )}
              aria-current={active ? 'step' : undefined}
              title={STAGE_META[step].label}
            >
              {done ? <Check className="size-3" /> : <Icon className="size-3" />}
            </span>
            <span
              className={cn(
                'hidden truncate text-[11px] xl:inline',
                active ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              {STAGE_META[step].label}
            </span>
            {index < STAGE_ORDER.length - 1 ? (
              <span
                className={cn(
                  'h-px min-w-3 flex-1',
                  index < current ? 'bg-primary' : 'bg-border-subtle',
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};
