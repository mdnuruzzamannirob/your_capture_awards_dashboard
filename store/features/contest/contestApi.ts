import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, ContestStats } from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  tagTypes: ['Contests', 'Contest'],
  endpoints: (builder) => ({
    getContestStats: builder.query<ApiSuccessResponse<ContestStats>, void>({
      query: () => '/dashboard/contest/stats',
    }),

    createContest: builder.mutation<{ data: unknown }, any>({
      query: (credentials) => ({
        url: '/contests',
        method: 'POST',
        body: credentials,
      }),
    }),

    getContests: builder.query<{ data: any }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/contests/all?page=${page}&limit=${limit}`,
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
  useGetContestsQuery,
  useLazyGetContestsQuery,
  useGetContestQuery,
  useLazyGetContestQuery,
} = contestApi;
