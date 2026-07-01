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

const getUserStatus = (user: User) => {
  if (user.isDeleted) return 'Deleted';
  if (user.isBlocked || user.is_blocked) return 'Blocked';
  return 'Active';
};

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
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    id: 'activeStatus',
    header: 'STATUS',
    size: 120,
    minSize: 110,
    cell: ({ row }) => {
      const status = getUserStatus(row.original);
      const statusStyles = {
        Active: 'bg-success/10 text-success ring-1 ring-success/20',
        Blocked: 'bg-destructive/10 text-destructive ring-1 ring-destructive/20',
        Deleted: 'bg-muted/10 text-muted-foreground ring-1 ring-muted/20',
      } as const;

      return (
        <span
          className={cn(
            'flex w-fit items-center gap-0.5 rounded px-2 py-1 text-xs font-medium whitespace-nowrap capitalize',
            statusStyles[status as keyof typeof statusStyles],
          )}
        >
          <GoDotFill /> {status}
        </span>
      );
    },
  },

  {
    id: 'actions',
    header: 'ACTIONS',
    enableHiding: false,
    cell: ({ row }) => {
      const isDeleted = Boolean(row.original.isDeleted);
      const isBlocked = Boolean(row.original.isBlocked || row.original.is_blocked);
      const isDisabled = isDeleted;
      const label = isDeleted ? 'Deleted' : isBlocked ? 'Unblock' : 'Block';

      return (
        <Button
          variant="outline"
          className={cn(
            'gap-2',
            isDisabled
              ? 'border-muted/20 bg-muted/10 text-muted-foreground cursor-not-allowed'
              : isBlocked
                ? 'border-success/20 bg-success/10 text-success hover:bg-success/20 hover:text-success'
                : 'border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive',
          )}
          disabled={isDisabled}
          onClick={(event) => {
            event.stopPropagation();
            if (!isDisabled) onToggleBlock(row.original);
          }}
        >
          {isDeleted ? (
            <ShieldMinus className="size-4" />
          ) : isBlocked ? (
            <ShieldCheck className="size-4" />
          ) : (
            <ShieldMinus className="size-4" />
          )}{' '}
          {label}
        </Button>
      );
    },
  },
];
