'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StoreProduct } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/common/data-table-column-header';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';

const typeColors = {
  key: 'border-amber-500/50 bg-amber-500/10 text-amber-600',
  boost: 'border-purple-500/50 bg-purple-500/10 text-purple-600',
  swap: 'border-pink-500/50 bg-pink-500/10 text-pink-600',
};

export const storeProductColumns: ColumnDef<StoreProduct>[] = [
  {
    accessorKey: 'productId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item ID" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground font-mono text-sm font-medium">
        {row.getValue('productId')}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item Name" />,
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="text-sm font-semibold">{row.getValue('name')}</p>
        <p className="text-muted-foreground text-xs">{row.original.description.slice(0, 50)}...</p>
      </div>
    ),
  },
  {
    accessorKey: 'productType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue('productType') as 'key' | 'boost' | 'swap';
      const icons = {
        key: '🔑',
        boost: '⚡',
        swap: '🔄',
      };
      return (
        <Badge variant="outline" className={cn('capitalize', typeColors[type])}>
          <span className="mr-1.5">{icons[type]}</span>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => (
      <div className="text-sm font-semibold">${(row.getValue('price') as number).toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'totalPurchases',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Purchases" />,
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue('totalPurchases') || 0}</div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Revenue" />,
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-green-600">
        ${((row.getValue('totalRevenue') as number) || 0).toFixed(2)}
      </div>
    ),
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
