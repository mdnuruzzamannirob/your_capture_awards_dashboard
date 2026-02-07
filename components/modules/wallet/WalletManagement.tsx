'use client';

import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { transactionColumns } from './transaction-columns';
import { WalletTransaction } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoDotFill } from 'react-icons/go';
import {
  Calendar,
  Clock,
  Mail,
  User,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

// Mock data - replace with actual API call
const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    transactionNumber: 'TXN-2025-001',
    userId: 'user_123',
    userName: 'John Smith',
    userEmail: 'john.s@example.com',
    type: 'store_purchase',
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    description: 'Lightroom Presets Pack',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5o',
    productId: 'prod_123',
    productName: 'Lightroom Presets Pack',
    balanceBefore: 300.0,
    balanceAfter: 300.0,
    createdAt: '2025-02-03T10:15:00Z',
    completedAt: '2025-02-03T10:16:00Z',
  },
  {
    id: '2',
    transactionNumber: 'TXN-2025-002',
    userId: 'user_456',
    userName: 'Jane Doe',
    userEmail: 'jane.d@example.com',
    type: 'subscription_payment',
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    description: 'Pro Monthly Subscription',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5p',
    subscriptionPlanId: 'plan_pro_monthly',
    subscriptionPlanName: 'Pro Monthly Plan',
    balanceBefore: 450.0,
    balanceAfter: 450.0,
    createdAt: '2025-02-03T09:00:00Z',
    completedAt: '2025-02-03T09:01:00Z',
  },
  {
    id: '3',
    transactionNumber: 'TXN-2025-003',
    userId: 'user_321',
    userName: 'Emma Wilson',
    userEmail: 'emma.w@example.com',
    type: 'store_purchase',
    amount: 79.99,
    currency: 'USD',
    status: 'completed',
    description: 'Professional Photo Editing Course',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5o2',
    productId: 'prod_456',
    productName: 'Professional Photo Editing Course',
    balanceBefore: 500.0,
    balanceAfter: 420.01,
    createdAt: '2025-02-02T14:20:00Z',
    completedAt: '2025-02-02T14:21:00Z',
  },
  {
    id: '4',
    transactionNumber: 'TXN-2025-004',
    userId: 'user_654',
    userName: 'David Brown',
    userEmail: 'david.b@example.com',
    type: 'subscription_payment',
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    description: 'Premium Annual Subscription',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5q',
    subscriptionPlanId: 'plan_premium_yearly',
    subscriptionPlanName: 'Premium Annual Plan',
    balanceBefore: 800.0,
    balanceAfter: 800.0,
    createdAt: '2025-02-02T11:00:00Z',
    completedAt: '2025-02-02T11:01:00Z',
  },
  {
    id: '5',
    transactionNumber: 'TXN-2025-005',
    userId: 'user_987',
    userName: 'Sarah Davis',
    userEmail: 'sarah.d@example.com',
    type: 'store_purchase',
    amount: 129.99,
    currency: 'USD',
    status: 'completed',
    description: 'Premium Photography Templates Bundle',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5r',
    productId: 'prod_789',
    productName: 'Premium Photography Templates Bundle',
    balanceBefore: 600.0,
    balanceAfter: 600.0,
    createdAt: '2025-02-01T16:30:00Z',
    completedAt: '2025-02-01T16:31:00Z',
  },
  {
    id: '6',
    transactionNumber: 'TXN-2025-006',
    userId: 'user_258',
    userName: 'Emily Jones',
    userEmail: 'emily.j@example.com',
    type: 'refund',
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    description: 'Refund - Cancelled store product order',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5s',
    productId: 'prod_321',
    productName: 'Lightroom Presets Pack',
    balanceBefore: 300.0,
    balanceAfter: 349.99,
    createdAt: '2025-01-31T10:00:00Z',
    completedAt: '2025-01-31T15:30:00Z',
  },
  {
    id: '7',
    transactionNumber: 'TXN-2025-007',
    userId: 'user_369',
    userName: 'Chris Martin',
    userEmail: 'chris.m@example.com',
    type: 'subscription_payment',
    amount: 19.99,
    currency: 'USD',
    status: 'completed',
    description: 'Basic Monthly Subscription',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5t',
    subscriptionPlanId: 'plan_basic_monthly',
    subscriptionPlanName: 'Basic Monthly Plan',
    balanceBefore: 200.0,
    balanceAfter: 200.0,
    createdAt: '2025-01-30T09:30:00Z',
    completedAt: '2025-01-30T09:31:00Z',
  },
  {
    id: '8',
    transactionNumber: 'TXN-2025-008',
    userId: 'user_741',
    userName: 'Anna White',
    userEmail: 'anna.w@example.com',
    type: 'store_purchase',
    amount: 39.99,
    currency: 'USD',
    status: 'completed',
    description: 'Photography eBook Collection',
    paymentGateway: 'paypal',
    productId: 'prod_654',
    productName: 'Photography eBook Collection',
    balanceBefore: 150.0,
    balanceAfter: 150.0,
    createdAt: '2025-01-29T13:45:00Z',
    completedAt: '2025-01-29T13:46:00Z',
  },
  {
    id: '9',
    transactionNumber: 'TXN-2025-009',
    userId: 'user_963',
    userName: 'Rachel Green',
    userEmail: 'rachel.g@example.com',
    type: 'subscription_payment',
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    description: 'Pro Plus Monthly Subscription',
    paymentGateway: 'stripe',
    stripePaymentId: 'pi_3OKj5fG3xY9Zh7Lk1k3M4N5u',
    subscriptionPlanId: 'plan_pro_plus_monthly',
    subscriptionPlanName: 'Pro Plus Monthly Plan',
    balanceBefore: 350.0,
    balanceAfter: 350.0,
    createdAt: '2025-01-27T10:00:00Z',
    completedAt: '2025-01-27T10:01:00Z',
  },
];

const WalletManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // Simulate loading state
  const isLoading = false;

  // In real app, replace with actual API call
  const data = mockTransactions;
  const total = mockTransactions.length;

  const handleStatusUpdate = () => {
    if (selectedTransaction && newStatus) {
      // In real app, make API call here
      setIsDialogOpen(false);
      setNewStatus('');
    }
  };

  return (
    <>
      <DataTable
        columns={transactionColumns}
        data={data}
        isLoading={isLoading}
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
          setNewStatus(transaction.status);
          setIsDialogOpen(true);
        }}
        filterableColumns={[
          { id: 'transactionNumber', placeholder: 'Search by transaction number...' },
        ]}
      />

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-sm',
                    selectedTransaction.status === 'completed' &&
                      'border-green-500/50 bg-green-500/10 text-green-600',
                    selectedTransaction.status === 'pending' &&
                      'border-yellow-500/50 bg-yellow-500/10 text-yellow-600',
                    selectedTransaction.status === 'failed' &&
                      'border-red-500/50 bg-red-500/10 text-red-600',
                  )}
                >
                  <GoDotFill className="mr-2 size-3" />
                  {selectedTransaction.status.charAt(0).toUpperCase() +
                    selectedTransaction.status.slice(1)}
                </Badge>

                <span className="text-muted-foreground text-sm">
                  {selectedTransaction.transactionNumber}
                </span>
              </div>

              {/* Transaction Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* User Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Name</p>
                        <p className="text-sm font-medium">{selectedTransaction.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Email</p>
                        <p className="text-sm font-medium">{selectedTransaction.userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Transaction Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="text-muted-foreground mt-0.5 size-4" />
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Type</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize',
                            selectedTransaction.type === 'store_purchase' &&
                              'border-blue-500/50 bg-blue-500/10 text-blue-600',
                            selectedTransaction.type === 'subscription_payment' &&
                              'border-green-500/50 bg-green-500/10 text-green-600',
                            selectedTransaction.type === 'refund' &&
                              'border-cyan-500/50 bg-cyan-500/10 text-cyan-600',
                          )}
                        >
                          {selectedTransaction.type.replace(/_/g, ' ')}
                        </Badge>
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
                    {selectedTransaction.paymentGateway && (
                      <div className="flex items-start gap-3">
                        <CreditCard className="text-muted-foreground mt-0.5 size-4" />
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-sm">Payment Gateway</p>
                          <p className="text-sm font-medium capitalize">
                            {selectedTransaction.paymentGateway.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product/Subscription Info */}
              {(selectedTransaction.productName || selectedTransaction.subscriptionPlanName) && (
                <div className="bg-muted/50 space-y-2 rounded-lg p-3">
                  <p className="text-sm font-semibold">
                    {selectedTransaction.productName
                      ? 'Product'
                      : selectedTransaction.subscriptionPlanName
                        ? 'Subscription Plan'
                        : 'Item'}
                  </p>
                  <p className="text-sm">
                    {selectedTransaction.productName || selectedTransaction.subscriptionPlanName}
                  </p>
                  {selectedTransaction.stripePaymentId && (
                    <p className="text-muted-foreground text-xs">
                      Stripe Payment ID: {selectedTransaction.stripePaymentId}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-muted/50 space-y-2 rounded-lg p-3">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>

              {/* Balance Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                  <ArrowDownLeft className="text-muted-foreground size-4" />
                  <div>
                    <p className="text-muted-foreground text-xs">Balance Before</p>
                    <p className="text-sm font-medium">
                      ${selectedTransaction.balanceBefore.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
                  <ArrowUpRight className="text-muted-foreground size-4" />
                  <div>
                    <p className="text-muted-foreground text-xs">Balance After</p>
                    <p className="text-sm font-medium">
                      ${selectedTransaction.balanceAfter.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Failure Reason */}
              {selectedTransaction.failureReason && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <p className="mb-1 text-sm font-semibold text-red-600">Failure Reason</p>
                  <p className="text-sm text-red-600">{selectedTransaction.failureReason}</p>
                </div>
              )}

              {/* Timestamps */}
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
                {selectedTransaction.completedAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-muted-foreground size-4" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm">Completed At</p>
                      <p className="text-sm">
                        {new Date(selectedTransaction.completedAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Update Status Section */}
              {selectedTransaction.status === 'pending' && (
                <div className="space-y-4 border-t pt-4">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleStatusUpdate} className="w-full">
                    Update Status
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletManagement;
