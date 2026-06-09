'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { SupportTicket } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';

const statusStyles: Record<SupportTicket['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-600',
  'in-progress': 'bg-blue-500/20 text-blue-600',
  resolved: 'bg-green-500/20 text-green-600',
  closed: 'bg-gray-500/20 text-gray-600',
};

const priorityStyles: Record<SupportTicket['priority'], string> = {
  high: 'bg-red-500/20 text-red-600 hover:bg-red-500/30',
  medium: 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30',
  low: 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
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
      return (
        <Badge className={cn('capitalize', priorityStyles[priority])}>{priority}</Badge>
      );
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
            'flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium capitalize',
            statusStyles[status],
          )}
        >
          <GoDotFill /> {status.replace('-', ' ')}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewTicket(row.original);
            }}
          >
            <Eye className="mr-2 size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onViewTicket(row.original);
            }}
          >
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
