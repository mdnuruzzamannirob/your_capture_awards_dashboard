'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn, formatDateWithTime } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';

export const columns: ColumnDef<any>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="capitalize">{row.original.title}</div>,
  },
  {
    accessorKey: 'creator',
    header: 'Creator',
    cell: ({ row }) => {
      const { creator } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Image
            alt="Profile"
            src={creator?.avatar}
            width={32}
            height={32}
            className="size-8 min-w-8 overflow-hidden rounded-full bg-gray-900 object-cover"
          />
          <div className="">
            <h3 className="text-sm font-medium">{creator?.fullName}</h3>
            <p className="text-muted-foreground text-xs">{creator?.email}</p>
          </div>
        </div>
      );
    },
  },

  {
    id: 'maxUpload',
    header: 'Max Upload',
    cell: ({ row }) => <div className="capitalize">{row.original.maxUploads}</div>,
  },
  {
    id: 'mode',
    header: 'Mode',
    cell: ({ row }) => <div className="capitalize">{row.original.mode}</div>,
  },
  {
    id: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const { day, hours, minutes, month, timeZone, year } = formatDateWithTime(
        row.original.startDate,
      );

      return (
        <div className="capitalize">
          {day} {month} {year}, {hours}:{minutes}{' '}
          <span className="text-muted-foreground text-xs font-medium">{timeZone}</span>
        </div>
      );
    },
  },
  {
    id: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const { day, hours, minutes, month, timeZone, year } = formatDateWithTime(
        row.original.endDate,
      );

      return (
        <div className="capitalize">
          {day} {month} {year}, {hours}:{minutes}{' '}
          <span className="text-muted-foreground text-xs font-medium">{timeZone}</span>
        </div>
      );
    },
  },

  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <button
          className={cn(
            'text-foreground flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium capitalize',
            status === 'ACTIVE' && 'bg-green-500/20 text-green-600',
            status === 'CLOSED' && 'bg-red-500/20 text-red-600',
            status === 'UPCOMING' && 'bg-yellow-500/20 text-yellow-600',
          )}
        >
          <GoDotFill /> {status}
        </button>
      );
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <Button variant="outline" onClick={(event) => event.stopPropagation()}>
          <Pen className="size-3" />
        </Button>
      );
    },
  },
];
