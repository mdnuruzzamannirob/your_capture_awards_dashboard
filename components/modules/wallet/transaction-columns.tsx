'use client';

import { cn } from '@/lib/utils';
import { PaymentTransaction } from '@/store/features/wallet/types';
import { ColumnDef } from '@tanstack/react-table';
import { GoDotFill } from 'react-icons/go';

export const transactionColumns: ColumnDef<PaymentTransaction>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'id',
    header: 'TRANSACTION ID',
    cell: ({ row }) => <div className="font-mono text-xs font-semibold">{row.getValue('id')}</div>,
  },
  {
    id: 'user',
    header: 'USER',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.user.fullName || 'Unknown User'}</div>
        <div className="text-muted-foreground text-xs">{row.original.user.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <div className="font-semibold">
          {row.original.currency} {amount.toFixed(2)}
        </div>
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
            'flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium',
            status === 'SUCCEEDED' && 'bg-green-500/20 text-green-600',
            status === 'PENDING' && 'bg-yellow-500/20 text-yellow-600',
            status === 'FAILED' && 'bg-red-500/20 text-red-600',
            status === 'EXPIRED' && 'bg-zinc-500/20 text-zinc-600',
          )}
        >
          <GoDotFill /> {status}
        </button>
      );
    },
  },
  {
    accessorKey: 'method',
    header: 'METHOD',
    cell: ({ row }) => <div className="text-sm capitalize">{row.getValue('method')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="text-xs">
          <div>{date.toLocaleDateString('en-US')}</div>
          <div className="text-muted-foreground">
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      );
    },
  },
];
