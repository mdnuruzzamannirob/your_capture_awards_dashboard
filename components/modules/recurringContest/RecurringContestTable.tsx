'use client';

import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetRecurringContestsQuery } from '@/store/features/recurringContest/recurringContestApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { columns } from './recurring-contest-columns';

const RecurringContestTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [tab, setTab] = useState<'all' | 'active' | 'ended'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetRecurringContestsQuery({
    page,
    limit,
    tab: tab === 'all' ? undefined : tab,
    search: search || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search recurring contests..."
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as 'all' | 'active' | 'ended');
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
    </div>
  );
};

export default RecurringContestTable;
