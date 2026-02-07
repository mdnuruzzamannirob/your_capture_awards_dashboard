'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SupportTicket } from '@/types';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';
import { Eye, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const supportColumns: ColumnDef<SupportTicket>[] = [
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
    accessorKey: 'userName',
    header: 'USER',
    cell: ({ row }) => <div>{row.getValue('userName') || 'N/A'}</div>,
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
      const priority = row.getValue('priority') as string;
      return (
        <Badge
          className={cn(
            'capitalize',
            priority === 'high' && 'bg-red-500/20 text-red-600 hover:bg-red-500/30',
            priority === 'medium' && 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30',
            priority === 'low' && 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
          )}
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <button
          className={cn(
            'flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium capitalize',
            status === 'resolved' && 'bg-green-500/20 text-green-600',
            status === 'in-progress' && 'bg-blue-500/20 text-blue-600',
            status === 'pending' && 'bg-yellow-500/20 text-yellow-600',
            status === 'closed' && 'bg-gray-500/20 text-gray-600',
          )}
        >
          <GoDotFill /> {status.replace('-', ' ')}
        </button>
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
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              Mark as Resolved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Mark as Closed</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
