'use client';

import { DataTable, FilterableColumn } from '@/components/common/DataTable';
import { columns } from './contest-columns';
import { useState } from 'react';
import { useGetContestsQuery } from '@/store/features/contest/contestApi';
import { useRouter } from 'next/navigation';

const ContestTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isFetching } = useGetContestsQuery({ page, limit });

  const filterColumns: FilterableColumn[] = [{ id: 'title', placeholder: 'Filter by name...' }];
  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      page={page}
      pageSize={limit}
      total={data?.data?.length ?? 0}
      filterableColumns={filterColumns}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setLimit(size);
        setPage(1);
      }}
      onRowClick={(value) => {
        router.push(`/contest/${value.id}`);
      }}
      isLoading={isLoading || isFetching}
    />
  );
};

export default ContestTable;
