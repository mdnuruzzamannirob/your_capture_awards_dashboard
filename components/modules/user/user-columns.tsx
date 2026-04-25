'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@/store/features/user/types';
import { ColumnDef } from '@tanstack/react-table';
import { ShieldCheck, ShieldMinus } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';

interface UserColumnsOptions {
  onToggleBlock: (user: User) => void;
}

export const getUserColumns = ({ onToggleBlock }: UserColumnsOptions): ColumnDef<User>[] => [
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
    cell: ({ row }) => <div>{row.getValue('username') || '--'}</div>,
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
    cell: ({ row }) => <div>{row.getValue('country') || '--'}</div>,
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    id: 'activeStatus',
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
    header: 'ACTIONS',
    enableHiding: false,
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Button
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            onToggleBlock(row.original);
          }}
        >
          {isActive ? <ShieldMinus className="size-4" /> : <ShieldCheck className="size-4" />}{' '}
          {isActive ? 'Block' : 'Unblock'}
        </Button>
      );
    },
  },
];
