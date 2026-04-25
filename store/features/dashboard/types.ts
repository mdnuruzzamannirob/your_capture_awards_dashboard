export interface DashboardContestTotals {
  running: number;
  upcoming: number;
  completed: number;
  total: number;
}

export interface DashboardTotalIncomeData {
  totalIncome: number;
  incomeByMonth: Record<string, number>;
}

export interface DashboardMemberRatio {
  premium: number;
  pro: number;
}

export interface DashboardRevenueByType {
  store: number;
  contest: number;
  subscription: number;
  total: number;
}

export interface DashboardRecentContest {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
  };
  totalPhoto: number;
  participantCount: number;
}

export interface DashboardOverview {
  totalUsers: number;
  totalContests: DashboardContestTotals;
  totalPayments: number;
  totalIncomeData: DashboardTotalIncomeData;
  active_user_count: number;
  inactive_user_count: number;
  paid_members_count: number;
  pro_member_count: number;
  premium_member_count: number;
  member_ratio: DashboardMemberRatio[];
  revenueByType: DashboardRevenueByType[];
  recentContests: DashboardRecentContest[];
  userGrowthByMonth: number[];
  totalRevenue: number;
  totalActiveContests: number;
  totalStoreSalesRevenue: number;
}

export interface DashboardUserStats {
  totalUsers: number;
  active_user_count: number;
  inactive_user_count: number;
  paid_members_count: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
