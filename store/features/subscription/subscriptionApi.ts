import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  CreateSubscriptionPlanBody,
  PlanStatus,
  SubscriptionPlan,
  SubscriptionPlansListResponse,
  SubscriptionStats,
  UpdateSubscriptionPlanBody,
} from './types';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery,
  tagTypes: ['SubscriptionPlans', 'SubscriptionStats'],
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<
      SubscriptionPlansListResponse,
      { status?: PlanStatus; page?: number; limit?: number }
    >({
      query: ({ status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.append('status', status);
        return `/dashboard/subscription-plans?${params.toString()}`;
      },
      providesTags: [{ type: 'SubscriptionPlans', id: 'LIST' }],
    }),

    getSubscriptionStats: builder.query<ApiSuccessResponse<SubscriptionStats>, void>({
      query: () => '/dashboard/plans/stats',
      providesTags: [{ type: 'SubscriptionStats', id: 'SINGLE' }],
    }),

    createSubscriptionPlan: builder.mutation<
      ApiSuccessResponse<SubscriptionPlan>,
      CreateSubscriptionPlanBody
    >({
      query: (body) => ({
        url: '/dashboard/subscription-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'SubscriptionPlans', id: 'LIST' },
        { type: 'SubscriptionStats', id: 'SINGLE' },
      ],
    }),

    updateSubscriptionPlan: builder.mutation<
      ApiSuccessResponse<SubscriptionPlan>,
      UpdateSubscriptionPlanBody
    >({
      query: ({ id, ...body }) => ({
        url: `/dashboard/subscription-plans/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'SubscriptionPlans', id: 'LIST' },
        { type: 'SubscriptionStats', id: 'SINGLE' },
      ],
    }),

    deleteSubscriptionPlan: builder.mutation<ApiSuccessResponse<null>, { id: string }>({
      query: ({ id }) => ({
        url: `/dashboard/subscription-plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'SubscriptionPlans', id: 'LIST' },
        { type: 'SubscriptionStats', id: 'SINGLE' },
      ],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatsQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = subscriptionApi;
