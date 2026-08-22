import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, DashboardOverview, DashboardUserStats } from './types';

const toMonthArray = <T>(value: T[] | Record<string, T> | undefined, fallback: T): T[] => {
  if (Array.isArray(value)) return value;

  return Array.from({ length: 12 }, (_, index) => value?.[String(index + 1)] ?? fallback);
};

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['DashboardOverview', 'DashboardUserStats'],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<ApiSuccessResponse<DashboardOverview>, void>({
      query: () => '/dashboard/overview',
      transformResponse: (response: ApiSuccessResponse<any>) => ({
        ...response,
        data: {
          ...response.data,
          member_ratio: toMonthArray(response.data?.member_ratio, { premium: 0, pro: 0 }),
          revenueByType: toMonthArray(response.data?.revenueByType, {
            store: 0,
            contest: 0,
            subscription: 0,
            total: 0,
          }),
          userGrowthByMonth: toMonthArray(response.data?.userGrowthByMonth, 0),
        },
      }),
      providesTags: [{ type: 'DashboardOverview', id: 'SINGLE' }],
    }),
    getDashboardUserStats: builder.query<ApiSuccessResponse<DashboardUserStats>, void>({
      query: () => '/dashboard/user-stats',
      providesTags: [{ type: 'DashboardUserStats', id: 'SINGLE' }],
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetDashboardUserStatsQuery } = dashboardApi;
