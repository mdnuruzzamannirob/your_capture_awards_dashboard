'use client';

import { DataTablePagination } from '@/components/common/data-table-pagination';
import { DataTableViewOptions } from '@/components/common/data-table-view-options';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  hideViewOptions?: boolean;
  hideSearch?: boolean;
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
  hideViewOptions = false,
  hideSearch = false,
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
      const query = String(filterValue ?? '')
        .trim()
        .toLowerCase();
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
    <div className="border-border-subtle bg-surface w-full overflow-hidden rounded-lg border">
      {(!hideSearch || !hideViewOptions) && (
        <div className="border-border-subtle flex min-h-13 items-center gap-3 border-b bg-[var(--bg-inset)] px-3.5 py-2.5">
          {!hideSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="text-caption-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                placeholder={searchPlaceholder ?? firstFilterableColumn?.placeholder ?? 'Search...'}
                disabled={isLoading}
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="bg-surface pl-8"
              />
            </div>
          )}
          {!hideViewOptions && (
            <div className="ml-auto">
              <DataTableViewOptions table={table} />
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden">
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

      <div
        className={cn(
          'border-border-subtle border-t bg-[var(--bg-inset)] px-3.5 py-2.5',
          isLoading && 'pointer-events-none opacity-50',
        )}
      >
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
