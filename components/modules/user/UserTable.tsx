'use client';

import { DataTable } from '@/components/common/DataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { User } from '@/store/features/user/types';
import { useGetUsersQuery, useToggleUserBlockMutation } from '@/store/features/user/userApi';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import { toast } from 'sonner';
import { getUserColumns } from './user-columns';

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetUsersQuery({ page, limit });
  const [toggleUserBlock, { isLoading: isTogglingBlock }] = useToggleUserBlockMutation();

  const columns = useMemo(
    () =>
      getUserColumns({
        onToggleBlock: (user) => {
          setToggleTarget(user);
          setIsToggleDialogOpen(true);
        },
      }),
    [],
  );

  const formatDisplayName = (user: User | null) => {
    if (!user) return '';
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.fullName || user.email;
  };

  const getApiErrorMessage = (error: unknown) => {
    if (!error || typeof error !== 'object') return 'Failed to update block status.';

    if ('data' in error) {
      const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
      if (data?.message) return data.message;
      if (data?.error?.message) return data.error.message;
    }

    if ('message' in error && typeof (error as { message?: string }).message === 'string') {
      return (error as { message: string }).message;
    }

    return 'Failed to update block status.';
  };

  const handleConfirmToggleBlock = async () => {
    if (!toggleTarget?.id) return;

    try {
      const result = await toggleUserBlock({ userId: toggleTarget.id }).unwrap();
      toast.success(result.message || 'User block status updated successfully.');
      setIsToggleDialogOpen(false);
      setToggleTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

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
                  src={selectedRow?.cover || '/images/logo.png'}
                  width={300}
                  height={200}
                  className="size-full rounded-xl bg-black object-cover"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="-mt-14 size-28 overflow-hidden rounded-full border-3 border-black">
                  <Image
                    alt="Profile Photo"
                    src={selectedRow?.avatar || '/images/logo.png'}
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg font-semibold">{formatDisplayName(selectedRow)}</h1>
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
                  { title: 'Subscription Plan', value: selectedRow?.purchased_plan || 'FREE' },
                  { title: 'Status', value: selectedRow?.isActive ? 'ACTIVE' : 'INACTIVE' },
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
                      <p className="px-3 py-2">{item.value || '--'}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleTarget?.isActive ? 'Block user?' : 'Unblock user?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleTarget?.isActive
                ? `This will block ${formatDisplayName(toggleTarget)} and restrict their access.`
                : `This will unblock ${formatDisplayName(toggleTarget)} and restore their access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingBlock}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleBlock} disabled={isTogglingBlock}>
              {isTogglingBlock ? 'Updating...' : toggleTarget?.isActive ? 'Block' : 'Unblock'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
