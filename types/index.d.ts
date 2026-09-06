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

export type ContestDetailsTabKey =
  | 'details'
  | 'prizes'
  | 'rules'
  | 'rank'
  | 'winners'
  | 'participants'
  | 'photos';

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

export type ReportReason = 'OFF_TOPIC' | 'COPYRIGHT' | 'AI_GENERATED' | 'INAPPROPRIATE_CONTENT';
export type ReportStatus = 'PENDING' | 'ACTION_TAKEN' | 'DISMISSED';

export interface ReportUserSummary {
  id: string;
  username: string | null;
  fullName: string | null;
  email: string;
  avatar: string | null;
  isBlocked?: boolean;
}

export interface ReportContestSummary {
  id: string;
  title: string;
  description: string;
  banner: string | null;
}

export interface ReportContestPhotoSummary {
  id: string;
  title: string | null;
  contestId: string;
  photo: { id: string; url: string; title: string | null } | null;
  contest: ReportContestSummary | null;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  contestPhotoId: string | null;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  reviewedById: string | null;
  reviewedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: ReportUserSummary | null;
  reportedUser: ReportUserSummary | null;
  contestPhoto: ReportContestPhotoSummary | null;
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
