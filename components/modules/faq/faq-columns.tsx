'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Faq } from '@/store/features/faq/types';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';

export const createFaqColumns = (
  onEditFaq: (faq: Faq) => void,
  onDeleteFaq: (faq: Faq) => void,
): ColumnDef<Faq>[] => [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'question',
    header: 'QUESTION',
    cell: ({ row }) => (
      <div className="max-w-[360px] truncate font-medium">{row.getValue('question')}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY',
    cell: ({ row }) => {
      const category = row.getValue('category') as string | null;
      return <span className="text-muted-foreground text-sm">{category || 'General'}</span>;
    },
  },
  {
    accessorKey: 'order',
    header: 'ORDER',
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('order')}</span>,
  },
  {
    accessorKey: 'isActive',
    header: 'STATUS',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <span
          className={cn(
            'inline-flex w-fit items-center justify-center gap-1 rounded-sm px-[7px] py-0.5 text-[11px] font-medium',
            isActive ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground',
          )}
        >
          <GoDotFill className="size-2" />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'UPDATED',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return <div className="text-xs">{date.toLocaleDateString('en-US')}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onEditFaq(row.original);
          }}
          variant="ghost"
          className="size-8 p-0"
          aria-label="Edit FAQ"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onDeleteFaq(row.original);
          }}
          variant="ghost"
          className="text-destructive hover:text-destructive size-8 p-0"
          aria-label="Delete FAQ"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];
