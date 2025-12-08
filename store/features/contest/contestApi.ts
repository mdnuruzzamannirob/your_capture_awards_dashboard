import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Contests', 'Contest'],
  endpoints: (builder) => ({
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
  useGetContestsQuery,
  useLazyGetContestsQuery,
  useGetContestQuery,
  useLazyGetContestQuery,
} = contestApi;
