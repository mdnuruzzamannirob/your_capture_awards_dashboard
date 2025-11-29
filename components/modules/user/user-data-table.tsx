'use client';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { DataTableViewOptions } from '@/components/common/data-table-view-options';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRow, setSelectedRow] = useState<TData | any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting,
      columnFilters,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;

      if (next.pageIndex + 1 !== page) onPageChange(next.pageIndex + 1);
      if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: TData) => {
    if (isLoading) return;
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center">
        <Input
          placeholder="Filter emails..."
          disabled={isLoading}
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>

      <div className="my-3 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Loading users...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        <DataTablePagination table={table} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="">
              <div className="h-54 w-full overflow-hidden rounded-xl border">
                <Image
                  alt="Cover Photo"
                  src={selectedRow?.cover}
                  width={300}
                  height={200}
                  className="size-full rounded-xl bg-black object-cover"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="-mt-14 size-28 overflow-hidden rounded-full border-3 border-black">
                  <Image
                    alt="Profile Photo"
                    src={selectedRow?.avatar}
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg font-semibold">
                    {selectedRow?.firstName + ' ' + selectedRow?.lastName}
                  </h1>
                  <p className="text-sm"> {selectedRow?.username && '@' + selectedRow?.username}</p>
                </div>
              </div>
              <h1 className="my-3 flex items-center gap-2 font-semibold">
                <Info className="size-4" /> Information
              </h1>

              <div className="rounded-sm border text-sm">
                {[
                  { title: 'Email', value: selectedRow?.email },
                  { title: 'Phone', value: selectedRow?.phone },
                  { title: 'Location', value: selectedRow?.location },
                  { title: 'Country', value: selectedRow?.country },
                  { title: 'Role', value: selectedRow?.role },
                  { title: 'Status', value: selectedRow?.isActive ? 'Active' : 'Inactive' },
                  { title: 'Level', value: selectedRow?.currentLevel },
                  { title: 'Voting Power', value: selectedRow?.voting_power },
                  { title: 'Subscription Plan', value: 'Free' },
                  { title: 'Created At', value: '14 Jan 2025' },
                ].map((item, index) => (
                  <div key={index} className={cn('flex items-center', index !== 0 && 'border-t')}>
                    <h3 className="w-40 border-r px-3 py-2 capitalize">{item.title}</h3>
                    <p className="px-3 py-2">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
