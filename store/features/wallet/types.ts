export type TransactionStatus = 'SUCCEEDED' | 'PENDING' | 'FAILED' | 'EXPIRED';
export type TransactionType = 'STORE' | 'SUBSCRIPTION' | 'CONTEST';
export type TransactionRecurring = 'ONETIME' | 'MONTHLY' | 'YEARLY';

export interface PaymentUser {
  id: string;
  avatar: string | null;
  fullName: string | null;
  email: string;
}

export interface PaymentTransaction {
  id: string;
  status: TransactionStatus;
  productId: string | null;
  planId: string | null;
  subscriptionId: string | null;
  planName: string | null;
  recurring: TransactionRecurring;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  type: TransactionType;
  stripe_session_id: string | null;
  createdAt: string;
  updatedAt: string;
  user: PaymentUser;
}

export interface WalletTransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
  thisMonthTotalRevenue: number;
  totalStoreRevenue: number;
  totalSubscriptionRevenue: number;
  averageTransactionValue: number;
}

export interface TransactionsListData {
  payments: PaymentTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentsListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: PaymentTransaction[];
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
