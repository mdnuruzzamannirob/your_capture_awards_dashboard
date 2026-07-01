'use client';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
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

// FilterableColumn interface
export interface FilterableColumn {
  id: string;
  placeholder: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?: (rowData: TData) => void;
  isLoading?: boolean;
  filterableColumns?: FilterableColumn[];
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  isLoading = false,
  filterableColumns = [],
  searchPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

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
      globalFilter,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;

      if (next.pageIndex + 1 !== page) onPageChange(next.pageIndex + 1);
      if (next.pageSize !== pageSize) onPageSizeChange(next.pageSize);
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? '').trim().toLowerCase();
      if (!query) return true;

      return row.getVisibleCells().some((cell) => {
        const value = cell.getValue();
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    },
  });

  const handleRowClick = (row: TData) => {
    if (isLoading) return;
    onRowClick?.(row);
  };

  const firstFilterableColumn = filterableColumns.length > 0 ? filterableColumns[0] : null;
  const skeletonRowCount = Math.min(pageSize, 10);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3">
        <Input
          placeholder={searchPlaceholder ?? firstFilterableColumn?.placeholder ?? 'Search...'}
          disabled={isLoading}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto">
          <DataTableViewOptions table={table} />
        </div>
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
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="h-[53px]" />
              ))
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
    </div>
  );
}
