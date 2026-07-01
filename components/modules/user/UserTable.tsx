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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { User } from '@/store/features/user/types';
import { useGetUsersQuery, useToggleUserBlockMutation } from '@/store/features/user/userApi';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import { toast } from 'sonner';
import { getUserColumns } from './user-columns';

const UserTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [selectedRow, setSelectedRow] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  useEffect(() => {
    const queryPage = Number(searchParams.get('page') ?? '1');
    const queryLimit = Number(searchParams.get('limit') ?? '20');
    const querySearch = searchParams.get('search') ?? '';
    const queryRole = searchParams.get('role') ?? 'all';

    setPage(Number.isFinite(queryPage) && queryPage > 0 ? queryPage : 1);
    setLimit(Number.isFinite(queryLimit) && queryLimit > 0 ? queryLimit : 20);
    setSearchInput(querySearch);
    setSearch(querySearch);
    setRole(queryRole.toUpperCase() || 'all');
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    if (search.trim()) params.set('search', search.trim());
    if (role && role !== 'all') params.set('role', role.toUpperCase());

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, limit, search, role, router]);

  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    limit,
    search,
    role: role === 'all' ? undefined : role,
  });
  const [toggleUserBlock, { isLoading: isTogglingBlock }] = useToggleUserBlockMutation();

  const columns = useMemo(
    () =>
      getUserColumns({
        onToggleBlock: (user) => {
          if (user.isDeleted) {
            toast.error('Deleted accounts cannot be updated.');
            return;
          }

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

  const getUserStatus = (user: User) => {
    if (user.isDeleted) return 'Deleted';
    if (user.isBlocked || user.is_blocked) return 'Blocked';
    return 'Active';
  };

  const isToggleBlocked = Boolean(toggleTarget?.isBlocked || toggleTarget?.is_blocked);
  const isToggleDeleted = Boolean(toggleTarget?.isDeleted);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-1">
        <Input
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className="border-input bg-background h-11 rounded-md border px-3 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

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
        hideViewOptions
        hideSearch
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
                  className="bg-background size-full rounded-xl object-cover"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="border-background -mt-14 size-28 overflow-hidden rounded-full border-3">
                  <Image
                    alt="Profile Photo"
                    src={selectedRow?.avatar || '/images/logo.png'}
                    width={100}
                    height={100}
                    
                    className="bg-background size-full object-cover"
                  />
                </div>
                <div className="">
                  <h1 className="text-lg font-semibold">{formatDisplayName(selectedRow)}</h1>
                  {/* username removed per request */}
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
                  { title: 'Role', value: selectedRow?.role },
                  { title: 'Level', value: selectedRow?.currentLevel },
                  // { title: 'Voting Power', value: selectedRow?.voting_power },
                  { title: 'Status', value: getUserStatus(selectedRow) },
                ].map((item, index) => (
                  <div key={index} className={cn('flex items-center', index !== 0 && 'border-t')}>
                    <h3 className="w-30 min-w-30 border-r px-3 py-2 capitalize">{item.title}</h3>

                    {item.title === 'Status' ? (
                      <button
                        key={index}
                        className={cn(
                          'text-foreground mx-3 flex items-center justify-center gap-0.5 rounded px-1.5 py-1 text-[10px] font-medium capitalize',
                          item.value === 'Active' && 'bg-success/10 text-success',
                          item.value === 'Blocked' && 'bg-destructive/10 text-destructive',
                          item.value === 'Deleted' && 'bg-muted/10 text-muted-foreground',
                        )}
                      >
                        <GoDotFill className="mb-0.5 size-2" /> {item.value}
                      </button>
                    ) : (
                      <p
                        title={typeof item.value === 'string' ? item.value : undefined}
                        className="truncate px-3 py-2"
                      >
                        {item.value || '--'}
                      </p>
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
              {isToggleDeleted ? 'Deleted user' : isToggleBlocked ? 'Unblock user?' : 'Block user?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isToggleDeleted
                ? `${formatDisplayName(toggleTarget)} is already deleted and cannot be updated.`
                : isToggleBlocked
                  ? `This will unblock ${formatDisplayName(toggleTarget)} and restore their access.`
                  : `This will block ${formatDisplayName(toggleTarget)} and restrict their access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingBlock}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleBlock}
              disabled={isTogglingBlock || isToggleDeleted}
            >
              {isTogglingBlock ? 'Updating...' : isToggleBlocked ? 'Unblock' : 'Block'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
