export type PlanName = 'FREE' | 'PRO' | 'PREMIUM';
export type PlanRecurring = 'ONETIME' | 'MONTHLY' | 'YEARLY';
export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface SubscriptionPlan {
  id: string;
  planName: PlanName;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  features: string[];
  amount: number;
  description: string;
  recurring: PlanRecurring;
  currency: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlansMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubscriptionStats {
  totalPlans: number;
  totalActiveSubscribers: number;
  totalSubscriptionRevenue: number;
  monthlySubscriptionRevenue: Record<string, number>;
}

export interface CreateSubscriptionPlanBody {
  planName: PlanName;
  features: string[];
  description: string;
  amount: number;
  recurring: PlanRecurring;
  currency: string;
  status: PlanStatus;
}

export interface UpdateSubscriptionPlanBody {
  id: string;
  planName: PlanName;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
  features: string[];
  amount: number;
  recurring: PlanRecurring;
  currency: string;
  status: PlanStatus;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SubscriptionPlansListResponse {
  success: boolean;
  message: string;
  meta: SubscriptionPlansMeta;
  data: SubscriptionPlan[];
}
