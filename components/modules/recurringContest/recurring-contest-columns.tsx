'use client';

import { Badge } from '@/components/ui/badge';
import { cn, formatDateWithTime } from '@/lib/utils';
import { getRecurrenceLabel } from '@/lib/recurringContest';
import type { RecurringContest } from '@/store/features/recurringContest/types';
import type { ColumnDef } from '@tanstack/react-table';
import { GoDotFill } from 'react-icons/go';
import RecurringStatusActions from './RecurringStatusActions';

function TableDate({ value }: { value?: string }) {
  const { day, hours, minutes, month, year } = formatDateWithTime(value ?? '');
  if (!day) return <span className="text-muted-foreground">—</span>;
  return (
    <span>
      {day} {month} {year}, {hours}:{minutes}
    </span>
  );
}

export const columns: ColumnDef<RecurringContest>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({ row }) => <div className="max-w-56 font-medium capitalize">{row.original.title}</div>,
  },
  {
    id: 'category',
    header: 'CATEGORY',
    cell: ({ row }) => row.original.category || <span className="text-muted-foreground">—</span>,
  },
  {
    id: 'recurrence',
    header: 'RECURRENCE',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant="outline">{getRecurrenceLabel(row.original.recurring.recurringType)}</Badge>
        <span className="text-muted-foreground text-[11px]">
          Next: <TableDate value={row.original.recurring.nextOccurrence} />
        </span>
      </div>
    ),
  },
  {
    id: 'generated',
    header: 'GENERATED',
    cell: ({ row }) => row.original.recurring.generatedOccurrences ?? 0,
  },
  {
    id: 'money',
    header: 'MONEY CONTEST',
    cell: ({ row }) => {
      const contest = row.original;
      if (!contest.isMoneyContest) return <span className="text-muted-foreground">No</span>;
      return (
        <span>
          {contest.minPrize ?? 0}–{contest.maxPrize ?? 0} {contest.currency ?? ''}
        </span>
      );
    },
  },
  {
    id: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={cn(
            'flex w-fit items-center gap-1 rounded-sm px-[7px] py-0.5 text-[11px] font-medium capitalize',
            status === 'ACTIVE' && 'bg-success-subtle text-success',
            status === 'ENDED' && 'bg-error-subtle text-destructive',
            status === 'PAUSED' && 'bg-warning-subtle text-warning',
          )}
        >
          <GoDotFill className="size-2" /> {status.toLowerCase()}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <RecurringStatusActions id={row.original.id} status={row.original.status} />
    ),
  },
];
