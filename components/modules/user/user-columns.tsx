'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/store/features/user/types';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<User>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'username',
    header: 'UID',
    cell: ({ row }) => <div>{row.getValue('username')}</div>,
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;

      const fullName = [firstName, lastName].filter(Boolean).join(' ');

      return <div className="capitalize">{fullName}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },

  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => <div>{row.getValue('country')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.isActive ? 'Active' : 'Inactive';

      return (
        <Badge variant={row.original.isActive ? 'secondary' : 'destructive'} className="capitalize">
          {status}
        </Badge>
      );
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      console.log(data);
      return (
        <Button variant="outline" onClick={(event) => event.stopPropagation()}>
          <Pen />
        </Button>
      );
    },
  },
];
