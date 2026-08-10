'use client';

import { DataTable } from '@/components/common/DataTable';
import { cn, formatDateWithTime } from '@/lib/utils';
import { useGetGeneratedContestsQuery } from '@/store/features/recurringContest/recurringContestApi';
import type { Contest } from '@/store/features/contest/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoDotFill } from 'react-icons/go';

function TableDate({ value }: { value?: string }) {
  const { day, hours, minutes, month, year } = formatDateWithTime(value ?? '');
  if (!day) return <span className="text-muted-foreground">—</span>;
  return (
    <span>
      {day} {month} {year}, {hours}:{minutes}
    </span>
  );
}

const columns: ColumnDef<Contest>[] = [
  {
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({ row }) => <div className="max-w-56 font-medium capitalize">{row.original.title}</div>,
  },
  {
    id: 'startDate',
    header: 'START DATE',
    cell: ({ row }) => <TableDate value={row.original.startDate} />,
  },
  {
    id: 'endDate',
    header: 'END DATE',
    cell: ({ row }) => <TableDate value={row.original.endDate} />,
  },
  {
    id: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={cn(
            'flex w-fit items-center gap-1 rounded-sm px-[7px] py-0.5 text-[11px] font-medium capitalize',
            status === 'ACTIVE' && 'bg-success-subtle text-success',
            (status === 'CLOSED' || status === 'COMPLETED') && 'bg-error-subtle text-destructive',
            status === 'UPCOMING' && 'bg-warning-subtle text-warning',
          )}
        >
          <GoDotFill className="size-2" /> {status}
        </span>
      );
    },
  },
];

const GeneratedContestsPanel = ({ id }: { id: string }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isFetching } = useGetGeneratedContestsQuery({ id, page, limit });

  return (
    <DataTable
      columns={columns}
      data={data?.data?.contests ?? []}
      page={page}
      pageSize={limit}
      total={data?.data?.total ?? 0}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setLimit(size);
        setPage(1);
      }}
      onRowClick={(value) => router.push(`/contest/${value.id}`)}
      isLoading={isLoading || isFetching}
      hideViewOptions
      hideSearch
    />
  );
};

export default GeneratedContestsPanel;
