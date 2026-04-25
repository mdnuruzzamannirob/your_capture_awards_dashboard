import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, DashboardOverview, DashboardUserStats } from './types';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['DashboardOverview', 'DashboardUserStats'],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<ApiSuccessResponse<DashboardOverview>, void>({
      query: () => '/dashboard/overview',
      providesTags: [{ type: 'DashboardOverview', id: 'SINGLE' }],
    }),
    getDashboardUserStats: builder.query<ApiSuccessResponse<DashboardUserStats>, void>({
      query: () => '/dashboard/user-stats',
      providesTags: [{ type: 'DashboardUserStats', id: 'SINGLE' }],
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetDashboardUserStatsQuery } = dashboardApi;
