'use client';

import { useGetUsersQuery } from '@/store/features/user/userApi';
import { columns } from './user-columns';
import { DataTable } from './user-data-table';
import { useState } from 'react';

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, limit });
  console.log(data?.data?.users);
  return (
    <div className="w-full space-y-5 rounded-xl bg-gray-900 p-5">
      <h3 className="text-xl font-medium">Users List</h3>

      <DataTable
        columns={columns}
        data={data?.data?.users ?? []}
        page={page}
        pageSize={limit}
        total={data?.data?.count ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
};

export default UserTable;
