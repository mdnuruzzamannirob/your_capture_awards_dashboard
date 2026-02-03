'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Report } from '@/types';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';
import { Eye, Check, X, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const reportColumns: ColumnDef<Report>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'reportNumber',
    header: 'REPORT #',
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold">{row.getValue('reportNumber')}</div>
    ),
  },
  {
    accessorKey: 'reportType',
    header: 'TYPE',
    cell: ({ row }) => {
      const type = row.getValue('reportType') as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            type === 'user' && 'border-purple-500/50 bg-purple-500/10 text-purple-600',
            type === 'contest' && 'border-blue-500/50 bg-blue-500/10 text-blue-600',
            type === 'content' && 'border-orange-500/50 bg-orange-500/10 text-orange-600',
            type === 'payment' && 'border-green-500/50 bg-green-500/10 text-green-600',
            type === 'other' && 'border-gray-500/50 bg-gray-500/10 text-gray-600',
          )}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'reportedItem',
    header: 'REPORTED ITEM',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">{row.getValue('reportedItem')}</div>
    ),
  },
  {
    accessorKey: 'reportedBy',
    header: 'REPORTED BY',
    cell: ({ row }) => <div>{row.getValue('reportedBy')}</div>,
  },
  {
    accessorKey: 'reason',
    header: 'REASON',
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate text-sm">{row.getValue('reason')}</div>
    ),
  },
  {
    accessorKey: 'severity',
    header: 'SEVERITY',
    cell: ({ row }) => {
      const severity = row.getValue('severity') as string;
      return (
        <Badge
          className={cn(
            'capitalize',
            severity === 'critical' && 'bg-red-600/20 text-red-700 hover:bg-red-600/30',
            severity === 'high' && 'bg-red-500/20 text-red-600 hover:bg-red-500/30',
            severity === 'medium' && 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30',
            severity === 'low' && 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
          )}
        >
          {severity === 'critical' && <AlertTriangle className="mr-1 size-3" />}
          {severity}
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
            status === 'under-review' && 'bg-blue-500/20 text-blue-600',
            status === 'pending' && 'bg-yellow-500/20 text-yellow-600',
            status === 'dismissed' && 'bg-gray-500/20 text-gray-600',
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
      const report = row.original;

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
              Mark as Under Review
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log('Resolve report:', report.id);
              }}
            >
              <Check className="mr-2 size-4" />
              Mark as Resolved
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log('Dismiss report:', report.id);
              }}
            >
              <X className="mr-2 size-4" />
              Dismiss Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Take action:', report.id);
              }}
            >
              <AlertTriangle className="mr-2 size-4" />
              Take Action
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
