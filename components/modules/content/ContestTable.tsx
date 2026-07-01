'use client';

import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/ui/input';
import { useGetContestsQuery } from '@/store/features/contest/contestApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { columns } from './contest-columns';

const ContestTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetContestsQuery({ page, limit, search });

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="contest-search" className="sr-only">
          Search contests
        </label>
        <Input
          id="contest-search"
          type="text"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setPage(1);
          }}
          placeholder="Search contests..."
          className="max-w-md"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.contests ?? []}
        page={page}
        pageSize={limit}
        total={data?.data?.total ?? data?.data?.count ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(value) => {
          router.push(`/contest/${value.id}`);
        }}
        isLoading={isLoading || isFetching}
        hideViewOptions
        hideSearch
      />
    </div>
  );
};

export default ContestTable;
