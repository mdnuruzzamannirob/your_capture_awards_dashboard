'use client';

import { DataTable } from '@/components/common/DataTable';
import { useGetRecurringContestsQuery } from '@/store/features/recurringContest/recurringContestApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { columns } from './recurring-contest-columns';

const RecurringContestTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isFetching } = useGetRecurringContestsQuery({ page, limit });

  return (
    <DataTable
      columns={columns}
      data={data?.data?.recurringContests ?? []}
      page={page}
      pageSize={limit}
      total={data?.data?.total ?? 0}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setLimit(size);
        setPage(1);
      }}
      onRowClick={(value) => router.push(`/recurring-contest/${value.id}`)}
      isLoading={isLoading || isFetching}
      hideViewOptions
      hideSearch
    />
  );
};

export default RecurringContestTable;
