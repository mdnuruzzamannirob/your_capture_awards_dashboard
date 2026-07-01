'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SupportTicket } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';

const statusStyles: Record<SupportTicket['status'], string> = {
  pending: 'bg-warning/10 text-warning',
  in_progress: 'bg-info/10 text-info',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-destructive/10 text-destructive',
};

const priorityStyles: Record<SupportTicket['priority'], string> = {
  high: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  medium: 'bg-warning/10 text-warning hover:bg-warning/20',
  low: 'bg-muted/20 text-muted-foreground hover:bg-muted/30',
};

export const createSupportColumns = (
  onViewTicket: (ticket: SupportTicket) => void,
): ColumnDef<SupportTicket>[] => [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'ticketNumber',
    header: 'TICKET #',
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold">{row.getValue('ticketNumber')}</div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'SUBJECT',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">{row.getValue('subject')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'priority',
    header: 'PRIORITY',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as SupportTicket['priority'];
      return <Badge className={cn('capitalize', priorityStyles[priority])}>{priority}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as SupportTicket['status'];
      return (
        <span
          className={cn(
            'inline-flex w-fit items-center justify-center gap-1 rounded px-2 py-1 text-xs font-medium capitalize',
            statusStyles[status],
          )}
        >
          <GoDotFill /> {status.replace('_', ' ')}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CREATED',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div className="text-xs">{date.toLocaleDateString('en-US')}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onViewTicket(row.original);
        }}
        variant="ghost"
        className="size-8 p-0"
      >
        <Eye className="size-4" />
      </Button>
    ),
  },
];
