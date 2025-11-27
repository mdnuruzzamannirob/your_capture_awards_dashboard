'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/common/data-table-column-header';

export const tableData: Payment[] = [
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  {
    id: '1',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '2',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: '3',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '4',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: '5',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
