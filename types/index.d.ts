export interface SideMenu {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export type ContestDetailsTabKey = 'details' | 'winners' | 'rules' | 'prizes' | 'rank';

export type SupportTicketStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  email: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  assignedTo?: string;
}

export type ReportType = 'user' | 'contest' | 'content' | 'payment' | 'other';
export type ReportStatus = 'pending' | 'under-review' | 'resolved' | 'dismissed';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  reportNumber: string;
  reportType: ReportType;
  reportedBy: string;
  reportedByEmail: string;
  reportedItem: string;
  reportedItemId: string;
  severity: ReportSeverity;
  status: ReportStatus;
  reason: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export type TransactionType = 'withdrawal' | 'store_purchase' | 'subscription_payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentGateway = 'stripe' | 'wallet' | 'paypal' | 'bank_transfer';

export interface WalletTransaction {
  id: string;
  transactionNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  paymentGateway?: PaymentGateway;
  stripePaymentId?: string;
  productId?: string;
  productName?: string;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  balanceBefore: number;
  balanceAfter: number;
  platformFee?: number;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  note?: string;
}

export interface UserWallet {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  balance: number;
  currency: string;
  totalWithdrawals: number;
  totalSpent: number;
  pendingWithdrawal: number;
  isActive: boolean;
  isFrozen: boolean;
  freezeReason?: string;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionBillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  planId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: SubscriptionBillingCycle;
  features: string[];
  subscribers: number;
  isActive: boolean;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  totalPlans: number;
  activePlans: number;
  totalSubscribers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export type StoreProductType = 'key' | 'boost' | 'swap';

export interface StoreProduct {
  id: string;
  productId: string;
  name: string;
  description: string;
  productType: StoreProductType;
  price: number;
  currency: string;
  quantity: number;
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}
