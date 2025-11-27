'use client';

import { columns, tableData } from './contest-columns';
import { DataTable } from './contest-data-table';

const ContestTable = () => {
  return (
    <div className="w-full space-y-5 rounded-xl bg-gray-900 p-5">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default ContestTable;
