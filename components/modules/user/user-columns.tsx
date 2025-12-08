'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/store/features/user/types';
import { cn } from '@/lib/utils';
import { GoDotFill } from 'react-icons/go';

export const columns: ColumnDef<User>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => <div>{row.getValue('username')}</div>,
  },
  {
    id: 'name',
    header: 'NAME',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;

      const fullName = [firstName, lastName].filter(Boolean).join(' ');

      return <div className="capitalize">{fullName}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },

  {
    accessorKey: 'country',
    header: 'COUNTRY',
    cell: ({ row }) => <div>{row.getValue('country')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    id: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.isActive ? 'ACTIVE' : 'INACTIVE';

      return (
        <button
          className={cn(
            'text-foreground flex items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-xs font-medium capitalize',
            status === 'ACTIVE' && 'bg-green-500/20 text-green-600',
            status === 'INACTIVE' && 'bg-red-500/20 text-red-600',
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
          <Pen />
        </Button>
      );
    },
  },
];
