import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  Contest,
  ContestCreationOptions,
  ContestStats,
  GetContestsResponse,
} from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  tagTypes: ['Contests', 'Contest', 'ContestStats', 'DashboardOverview'],
  endpoints: (builder) => ({
    getContestCreationOptions: builder.query<ApiSuccessResponse<ContestCreationOptions>, void>({
      query: () => '/contests/create-options',
      keepUnusedDataFor: 60 * 60,
    }),
    getContestStats: builder.query<ApiSuccessResponse<ContestStats>, void>({
      query: () => '/dashboard/contest/stats',
      providesTags: [{ type: 'ContestStats', id: 'SINGLE' }],
    }),

    createContest: builder.mutation<ApiSuccessResponse<Contest>, FormData>({
      query: (body) => ({
        url: '/contests',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Contests', id: 'LIST' },
              { type: 'ContestStats', id: 'SINGLE' },
              { type: 'DashboardOverview', id: 'SINGLE' },
            ]
          : [],
    }),

    updateContest: builder.mutation<ApiSuccessResponse<Contest>, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/contests/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: 'Contest', id },
              { type: 'Contests', id: 'LIST' },
              { type: 'ContestStats', id: 'SINGLE' },
              { type: 'DashboardOverview', id: 'SINGLE' },
            ]
          : [],
    }),

    getContests: builder.query<
      ApiSuccessResponse<GetContestsResponse>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 20, search }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        return `/contests/all?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.contests.map(({ id }) => ({
                type: 'Contest' as const,
                id,
              })),
              { type: 'Contests', id: 'LIST' },
            ]
          : [{ type: 'Contests', id: 'LIST' }],
    }),

    getContest: builder.query<ApiSuccessResponse<Contest>, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),
  }),
});

export const {
  useGetContestStatsQuery,
  useGetContestCreationOptionsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useGetContestsQuery,
  useLazyGetContestsQuery,
  useGetContestQuery,
  useLazyGetContestQuery,
} = contestApi;
