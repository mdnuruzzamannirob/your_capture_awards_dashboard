'use client';

import { columns, tableData } from './user-columns';
import { DataTable } from './user-data-table';

const UserTable = () => {
  return (
    <div className="w-full space-y-5 rounded-xl bg-gray-900 p-5">
      <h3 className="flex-1 text-xl font-medium">Users List</h3>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default UserTable;
