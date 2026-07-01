import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, ContestStats } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  tagTypes: ['Contests', 'Contest', 'ContestStats', 'DashboardOverview'],
  endpoints: (builder) => ({
    getContestStats: builder.query<ApiSuccessResponse<ContestStats>, void>({
      query: () => '/dashboard/contest/stats',
      providesTags: [{ type: 'ContestStats', id: 'SINGLE' }],
    }),

    createContest: builder.mutation<{ data: unknown }, any>({
      query: (credentials) => ({
        url: '/contests',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [
        { type: 'Contests', id: 'LIST' },
        { type: 'ContestStats', id: 'SINGLE' },
        { type: 'DashboardOverview', id: 'SINGLE' },
      ],
    }),

    updateContest: builder.mutation<{ data: unknown }, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/contests/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contest', id },
        { type: 'Contests', id: 'LIST' },
        { type: 'ContestStats', id: 'SINGLE' },
        { type: 'DashboardOverview', id: 'SINGLE' },
      ],
    }),

    getContests: builder.query<{ data: any }, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 20, search }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        return `/contests/all?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data?.contests?.map(({ id }: { id: any }) => ({
                type: 'Contest' as const,
                id,
              })),
              { type: 'Contests', id: 'LIST' },
            ]
          : [{ type: 'Contests', id: 'LIST' }],
    }),

    getContest: builder.query<any, { id: string }>({
      query: ({ id }) => `/contests/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),
  }),
});

export const {
  useGetContestStatsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useGetContestsQuery,
  useLazyGetContestsQuery,
  useGetContestQuery,
  useLazyGetContestQuery,
} = contestApi;
