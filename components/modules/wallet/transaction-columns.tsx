'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WalletTransaction } from '@/types';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';
import { Eye, Download, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const transactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'transactionNumber',
    header: 'TRANSACTION #',
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold">{row.getValue('transactionNumber')}</div>
    ),
  },
  {
    accessorKey: 'userName',
    header: 'USER',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('userName')}</div>
        <div className="text-muted-foreground text-xs">{row.original.userEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const isIncoming = ['refund'].includes(type);
      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            type === 'withdrawal' && 'border-red-500/50 bg-red-500/10 text-red-600',
            type === 'store_purchase' && 'border-blue-500/50 bg-blue-500/10 text-blue-600',
            type === 'subscription_payment' && 'border-green-500/50 bg-green-500/10 text-green-600',
            type === 'refund' && 'border-cyan-500/50 bg-cyan-500/10 text-cyan-600',
          )}
        >
          {isIncoming ? (
            <ArrowDownLeft className="mr-1 size-3" />
          ) : (
            <ArrowUpRight className="mr-1 size-3" />
          )}
          {type.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const type = row.original.type;
      const isIncoming = ['refund'].includes(type);
      return (
        <div className={cn('font-semibold', isIncoming ? 'text-green-600' : 'text-red-600')}>
          {isIncoming ? '+' : '-'}${amount.toFixed(2)}
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
            'flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium capitalize',
            status === 'completed' && 'bg-green-500/20 text-green-600',
            status === 'pending' && 'bg-yellow-500/20 text-yellow-600',
            status === 'failed' && 'bg-red-500/20 text-red-600',
            status === 'cancelled' && 'bg-gray-500/20 text-gray-600',
          )}
        >
          <GoDotFill /> {status}
        </button>
      );
    },
  },
  {
    accessorKey: 'paymentGateway',
    header: 'GATEWAY',
    cell: ({ row }) => {
      const gateway = row.getValue('paymentGateway') as string;
      return gateway ? (
        <div className="flex items-center gap-1 text-sm capitalize">
          {gateway === 'stripe' && '💳'}
          {gateway === 'wallet' && '💰'}
          {gateway === 'paypal' && '🅿️'}
          {gateway === 'bank_transfer' && '🏦'}
          <span>{gateway.replace('_', ' ')}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">N/A</span>
      );
    },
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
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

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
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Download className="mr-2 size-4" />
              Download Receipt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {transaction.status === 'pending' && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Check className="mr-2 size-4" />
                  Approve Transaction
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <X className="mr-2 size-4" />
                  Cancel Transaction
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
