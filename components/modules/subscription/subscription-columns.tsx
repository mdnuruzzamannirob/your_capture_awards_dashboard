'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SubscriptionPlan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/common/data-table-column-header';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';

export const subscriptionColumns: ColumnDef<SubscriptionPlan>[] = [
  {
    accessorKey: 'planId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plan ID" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground font-mono text-sm font-medium">
        {row.getValue('planId')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plan Name" />,
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="text-sm font-semibold">{row.getValue('name')}</p>
        <p className="text-muted-foreground line-clamp-1 text-xs">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: 'billingCycle',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Billing Cycle" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          'capitalize',
          row.getValue('billingCycle') === 'monthly' &&
            'border-blue-500/50 bg-blue-500/10 text-blue-600',
          row.getValue('billingCycle') === 'yearly' &&
            'border-green-500/50 bg-green-500/10 text-green-600',
        )}
      >
        {(row.getValue('billingCycle') as string).replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => (
      <div className="text-sm font-semibold">${(row.getValue('price') as number).toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'maxPhotos',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Max Photos" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue('maxPhotos')} <span className="text-muted-foreground text-xs">photos</span>
      </div>
    ),
  },
  {
    accessorKey: 'maxStorage',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Max Storage" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue('maxStorage')} <span className="text-muted-foreground text-xs">GB</span>
      </div>
    ),
  },
  {
    accessorKey: 'subscribers',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subscribers" />,
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('subscribers')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          row.getValue('isActive')
            ? 'border-green-500/50 bg-green-500/10 text-green-600'
            : 'border-gray-500/50 bg-gray-500/10 text-gray-600',
        )}
      >
        <GoDotFill className="mr-2 size-2" />
        {row.getValue('isActive') ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
