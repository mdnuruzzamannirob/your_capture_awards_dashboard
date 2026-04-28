'use client';

import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { PaymentTransaction } from '@/store/features/wallet/types';
import { useGetPaymentsQuery, useGetTransactionsQuery } from '@/store/features/wallet/walletApi';
import { Calendar, Clock, CreditCard, DollarSign, FileText, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { transactionColumns } from './transaction-columns';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
};

const WalletManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: transactionsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTransactionsQuery({ page, limit });

  const {
    data: paymentsResponse,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    error: paymentsError,
  } = useGetPaymentsQuery({ page: 1, limit: 5 });

  const transactions = transactionsResponse?.data?.payments ?? [];
  const total = transactionsResponse?.data?.total ?? 0;

  return (
    <>
      <div className="mb-4 rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Latest Successful Payments</h3>
          {isPaymentsLoading && <Spinner className="size-4" />}
        </div>

        {isPaymentsError ? (
          <p className="text-destructive text-sm">
            {getErrorMessage(paymentsError, 'Failed to load latest payments.')}
          </p>
        ) : (
          <div className="space-y-2">
            {(paymentsResponse?.data ?? []).slice(0, 5).map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-md border p-2 text-sm"
              >
                <p className="truncate pr-3">{payment.user.fullName || payment.user.email}</p>
                <p className="font-medium">
                  {payment.currency} {payment.amount.toFixed(2)}
                </p>
              </div>
            ))}
            {!paymentsResponse?.data?.length && !isPaymentsLoading && (
              <p className="text-muted-foreground text-sm">No successful payments found.</p>
            )}
          </div>
        )}
      </div>

      {isError && (
        <div className="mb-3 flex items-center justify-between rounded-lg border p-3">
          <p className="text-destructive text-sm">
            {getErrorMessage(error, 'Failed to load transactions.')}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      <DataTable
        columns={transactionColumns}
        data={transactions}
        isLoading={isLoading || isFetching}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(transaction) => {
          setSelectedTransaction(transaction);
          setIsDialogOpen(true);
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-sm',
                    selectedTransaction.status === 'SUCCEEDED' &&
                      'border-green-500/50 bg-green-500/10 text-green-600',
                    selectedTransaction.status === 'PENDING' &&
                      'border-yellow-500/50 bg-yellow-500/10 text-yellow-600',
                    selectedTransaction.status === 'FAILED' &&
                      'border-red-500/50 bg-red-500/10 text-red-600',
                    selectedTransaction.status === 'EXPIRED' &&
                      'border-zinc-500/50 bg-zinc-500/10 text-zinc-600',
                  )}
                >
                  {selectedTransaction.status}
                </Badge>

                <span className="text-muted-foreground font-mono text-xs">
                  {selectedTransaction.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Name</p>
                        <p className="text-sm font-medium">
                          {selectedTransaction.user.fullName || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Email</p>
                        <p className="text-sm font-medium">{selectedTransaction.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Transaction Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Type</p>
                        <p className="text-sm font-medium">{selectedTransaction.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Amount</p>
                        <p className="text-sm font-medium">
                          {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Method</p>
                        <p className="text-sm font-medium capitalize">
                          {selectedTransaction.method}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3 text-sm">
                <p>
                  Plan: <span className="font-medium">{selectedTransaction.planName || 'N/A'}</span>
                </p>
                <p>
                  Recurring: <span className="font-medium">{selectedTransaction.recurring}</span>
                </p>
                <p>
                  Session ID:{' '}
                  <span className="font-mono text-xs">
                    {selectedTransaction.stripe_sessino_id || 'N/A'}
                  </span>
                </p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground size-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm">Created At</p>
                    <p className="text-sm">
                      {new Date(selectedTransaction.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-muted-foreground size-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm">Updated At</p>
                    <p className="text-sm">
                      {new Date(selectedTransaction.updatedAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletManagement;
