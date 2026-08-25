'use client';

import { Badge } from '@/components/ui/badge';
import { cn, formatDateWithTime } from '@/lib/utils';
import type { Contest } from '@/store/features/contest/types';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { GoDotFill } from 'react-icons/go';

function TableDate({ value }: { value?: string }) {
  const { day, hours, minutes, month, year } = formatDateWithTime(value ?? '');
  if (!day) return <span className="text-muted-foreground">—</span>;
  return (
    <span>
      {day} {month} {year}, {hours}:{minutes}
    </span>
  );
}

export const columns: ColumnDef<Contest>[] = [
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
    id: 'creator',
    header: 'CREATOR',
    cell: ({ row }) => {
      const creator = row.original.creator;
      if (!creator) return <span className="text-muted-foreground">—</span>;
      const name = creator.fullName ?? 'Unknown creator';
      return (
        <div className="flex items-center gap-2">
          {creator.avatar ? (
            <Image
              alt={name}
              src={creator.avatar}
              width={32}
              height={32}
              className="bg-surface size-8 rounded-full object-cover"
            />
          ) : (
            <span className="bg-surface-tertiary flex size-8 items-center justify-center rounded-full text-xs font-semibold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-sm font-medium">{name}</p>
            {creator.email && (
              <p className="text-muted-foreground max-w-44 truncate text-xs">{creator.email}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'configuration',
    header: 'CONFIGURATION',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline">{row.original.rules?.length ?? 0} rules</Badge>
        <Badge variant="outline">
          {row.original.prizes?.length ?? row.original.awards?.length ?? 0} awards
        </Badge>
      </div>
    ),
  },
  {
    id: 'maxUpload',
    header: 'MAX UPLOAD',
    cell: ({ row }) => row.original.maxUpload ?? row.original.maxUploads ?? 0,
  },
  {
    id: 'startDate',
    header: 'START DATE',
    cell: ({ row }) => <TableDate value={row.original.startDate} />,
  },
  {
    id: 'endDate',
    header: 'END DATE',
    cell: ({ row }) => <TableDate value={row.original.endDate} />,
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
            (status === 'CLOSED' || status === 'COMPLETED') && 'bg-error-subtle text-destructive',
            status === 'UPCOMING' && 'bg-warning-subtle text-warning',
          )}
        >
          <GoDotFill className="size-2" /> {status}
        </span>
      );
    },
  },
];
