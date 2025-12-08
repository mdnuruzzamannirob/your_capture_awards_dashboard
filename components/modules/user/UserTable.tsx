'use client';

import { useGetUsersQuery } from '@/store/features/user/userApi';
import { columns } from './user-columns';
import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { GoDotFill } from 'react-icons/go';

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, limit });

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data?.users ?? []}
        page={page}
        pageSize={limit}
        total={data?.data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(value) => {
          setSelectedRow(value);
          setIsDialogOpen(true);
        }}
        isLoading={isLoading || isFetching}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-hidden sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <div className="max-h-[80vh] overflow-y-auto pb-1">
              <div className="h-54 w-full overflow-hidden rounded-xl border">
                <Image
                  alt="Cover Photo"
                  src={selectedRow?.cover}
                  width={300}
                  height={200}
                  className="size-full rounded-xl bg-black object-cover"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="-mt-14 size-28 overflow-hidden rounded-full border-3 border-black">
                  <Image
                    alt="Profile Photo"
                    src={selectedRow?.avatar}
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg font-semibold">
                    {selectedRow?.firstName + ' ' + selectedRow?.lastName}
                  </h1>
                  <p className="text-sm"> {selectedRow?.username && '@' + selectedRow?.username}</p>
                </div>
              </div>
              <h1 className="my-3 flex items-center gap-2 font-semibold">
                <Info className="size-4" /> Information
              </h1>

              <div className="rounded-sm border text-sm">
                {[
                  { title: 'Email', value: selectedRow?.email },
                  { title: 'Phone', value: selectedRow?.phone },
                  { title: 'Location', value: selectedRow?.location },
                  { title: 'Country', value: selectedRow?.country },
                  { title: 'Role', value: selectedRow?.role },
                  { title: 'Level', value: selectedRow?.currentLevel },
                  { title: 'Voting Power', value: selectedRow?.voting_power },
                  { title: 'Subscription Plan', value: 'Free' },
                  { title: 'Status', value: selectedRow?.isActive ? 'ACTIVE' : 'INACTIVE' },
                  { title: 'Created At', value: '14 Jan 2025' },
                ].map((item, index) => (
                  <div key={index} className={cn('flex items-center', index !== 0 && 'border-t')}>
                    <h3 className="w-40 border-r px-3 py-2 capitalize">{item.title}</h3>

                    {item.title === 'Status' ? (
                      <button
                        key={index}
                        className={cn(
                          'text-foreground mx-3 flex items-center justify-center gap-0.5 rounded-full px-1.5 py-1 text-[10px] font-medium capitalize',
                          item.value === 'ACTIVE' && 'bg-green-500/20 text-green-600',
                          item.value === 'INACTIVE' && 'bg-red-500/20 text-red-600',
                        )}
                      >
                        <GoDotFill className="mb-0.5 size-2" /> {item.value}
                      </button>
                    ) : (
                      <p className="px-3 py-2">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserTable;
