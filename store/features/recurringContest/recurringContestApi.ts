import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import type {
  ApiSuccessResponse,
  GetGeneratedContestsResponse,
  GetRecurringContestsResponse,
  RecurringContest,
  RecurringContestAward,
  RecurringContestLevelAward,
  ReplaceRecurringAwardsBody,
  ReplaceRecurringLevelAwardsBody,
  UpdateRecurringContestBody,
  UpdateRecurringIntervalBody,
} from './types';

export const recurringContestApi = createApi({
  reducerPath: 'recurringContestApi',
  baseQuery,
  tagTypes: [
    'RecurringContests',
    'RecurringContest',
    'RecurringContestAwards',
    'RecurringContestLevelAwards',
    'RecurringContestInstances',
  ],
  endpoints: (builder) => ({
    getRecurringContests: builder.query<
      ApiSuccessResponse<GetRecurringContestsResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => `/recurring-contests?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.recurringContests.map(({ id }) => ({
                type: 'RecurringContest' as const,
                id,
              })),
              { type: 'RecurringContests', id: 'LIST' },
            ]
          : [{ type: 'RecurringContests', id: 'LIST' }],
    }),

    getRecurringContest: builder.query<ApiSuccessResponse<RecurringContest>, { id: string }>({
      query: ({ id }) => `/recurring-contests/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'RecurringContest', id }],
    }),

    updateRecurringContest: builder.mutation<
      ApiSuccessResponse<RecurringContest>,
      { id: string; body: UpdateRecurringContestBody }
    >({
      query: ({ id, body }) => ({ url: `/recurring-contests/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContest', id },
        { type: 'RecurringContests', id: 'LIST' },
      ],
    }),

    updateRecurringInterval: builder.mutation<
      ApiSuccessResponse<RecurringContest>,
      { id: string; body: UpdateRecurringIntervalBody }
    >({
      query: ({ id, body }) => ({
        url: `/recurring-contests/${id}/interval`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContest', id },
        { type: 'RecurringContests', id: 'LIST' },
      ],
    }),

    pauseRecurringContest: builder.mutation<ApiSuccessResponse<RecurringContest>, { id: string }>({
      query: ({ id }) => ({ url: `/recurring-contests/${id}/pause`, method: 'PATCH' }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContest', id },
        { type: 'RecurringContests', id: 'LIST' },
      ],
    }),

    resumeRecurringContest: builder.mutation<ApiSuccessResponse<RecurringContest>, { id: string }>({
      query: ({ id }) => ({ url: `/recurring-contests/${id}/resume`, method: 'PATCH' }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContest', id },
        { type: 'RecurringContests', id: 'LIST' },
      ],
    }),

    endRecurringContest: builder.mutation<ApiSuccessResponse<RecurringContest>, { id: string }>({
      query: ({ id }) => ({ url: `/recurring-contests/${id}/end`, method: 'PATCH' }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContest', id },
        { type: 'RecurringContests', id: 'LIST' },
      ],
    }),

    getGeneratedContests: builder.query<
      ApiSuccessResponse<GetGeneratedContestsResponse>,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 20 }) =>
        `/recurring-contests/${id}/contests?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: 'RecurringContestInstances', id }],
    }),

    getRecurringAwards: builder.query<ApiSuccessResponse<RecurringContestAward[]>, { id: string }>({
      query: ({ id }) => `/recurring-contests/${id}/awards`,
      providesTags: (result, error, { id }) => [{ type: 'RecurringContestAwards', id }],
    }),

    replaceRecurringAwards: builder.mutation<
      ApiSuccessResponse<RecurringContestAward[]>,
      { id: string; body: ReplaceRecurringAwardsBody }
    >({
      query: ({ id, body }) => ({ url: `/recurring-contests/${id}/awards`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContestAwards', id },
        { type: 'RecurringContest', id },
      ],
    }),

    getRecurringLevelAwards: builder.query<ApiSuccessResponse<RecurringContestLevelAward[]>, { id: string }>({
      query: ({ id }) => `/recurring-contests/${id}/level-awards`,
      providesTags: (result, error, { id }) => [{ type: 'RecurringContestLevelAwards', id }],
    }),

    replaceRecurringLevelAwards: builder.mutation<
      ApiSuccessResponse<RecurringContestLevelAward[]>,
      { id: string; body: ReplaceRecurringLevelAwardsBody }
    >({
      query: ({ id, body }) => ({ url: `/recurring-contests/${id}/level-awards`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RecurringContestLevelAwards', id },
        { type: 'RecurringContest', id },
      ],
    }),
  }),
});

export const {
  useGetRecurringContestsQuery,
  useGetRecurringContestQuery,
  useUpdateRecurringContestMutation,
  useUpdateRecurringIntervalMutation,
  usePauseRecurringContestMutation,
  useResumeRecurringContestMutation,
  useEndRecurringContestMutation,
  useGetGeneratedContestsQuery,
  useGetRecurringAwardsQuery,
  useReplaceRecurringAwardsMutation,
  useGetRecurringLevelAwardsQuery,
  useReplaceRecurringLevelAwardsMutation,
} = recurringContestApi;
