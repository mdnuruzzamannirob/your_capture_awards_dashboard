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

export type ContestDetailsTabKey = 'details' | 'prizes' | 'rules' | 'rank' | 'winners';

export type SupportTicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
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
