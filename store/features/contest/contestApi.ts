import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  BannerCandidatesResponse,
  Contest,
  ContestCreationOptions,
  ContestParticipant,
  RankedPhotographersResponse,
  RankedPhotosResponse,
  ContestStats,
  GetContestsResponse,
} from './types';

export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery,
  tagTypes: ['Contests', 'Contest', 'ContestStats', 'DashboardOverview', 'ContestParticipants'],
  endpoints: (builder) => ({
    getContestCreationOptions: builder.query<ApiSuccessResponse<ContestCreationOptions>, void>({
      query: () => '/contests/create-options',
      keepUnusedDataFor: 60 * 60,
    }),
    getContestStats: builder.query<ApiSuccessResponse<ContestStats>, void>({
      query: () => '/dashboard/contest/stats',
      providesTags: [{ type: 'ContestStats', id: 'SINGLE' }],
    }),

    getBannerCandidates: builder.query<
      ApiSuccessResponse<BannerCandidatesResponse>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 24, search } = {}) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        return `/contests/banner-candidates?${params.toString()}`;
      },
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
      {
        page?: number;
        limit?: number;
        search?: string;
        tab?: 'active' | 'ended';
        includeArchived?: boolean;
      }
    >({
      query: ({ page = 1, limit = 20, search, tab, includeArchived }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        if (tab) params.set('tab', tab);
        if (includeArchived) params.set('includeArchived', 'true');
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

    getContestRankPhotos: builder.query<
      ApiSuccessResponse<RankedPhotosResponse>,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, page = 1, limit = 20 }) =>
        `/contests/${id}/rank-photos?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),

    getContestRankPhotographers: builder.query<
      ApiSuccessResponse<RankedPhotographersResponse>,
      { id: string; page?: number; limit?: number; level?: string }
    >({
      query: ({ id, page = 1, limit = 20, level }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (level) params.set('level', level);
        return `/contests/${id}/rank-photographer?${params.toString()}`;
      },
      providesTags: (result, error, { id }) => [{ type: 'Contest', id }],
    }),

    getContestParticipants: builder.query<
      ApiSuccessResponse<ContestParticipant[]>,
      { contestId: string; search?: string }
    >({
      query: ({ contestId, search }) => {
        const params = new URLSearchParams();
        if (search?.trim()) params.set('search', search.trim());
        const qs = params.toString();
        return `/contests/${contestId}/participants${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result, error, { contestId }) => [
        { type: 'ContestParticipants', id: contestId },
      ],
    }),

    adminDeleteContestPhoto: builder.mutation<
      ApiSuccessResponse<string>,
      { photoId: string; contestId: string; reason?: string; reportId?: string }
    >({
      query: ({ photoId, reason, reportId }) => ({
        url: `/contests/photos/${photoId}/admin`,
        method: 'DELETE',
        body: { reason, reportId },
      }),
      invalidatesTags: (result, error, { contestId }) => [{ type: 'Contest', id: contestId }],
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
  useGetContestRankPhotosQuery,
  useGetContestRankPhotographersQuery,
  useGetContestParticipantsQuery,
  useAdminDeleteContestPhotoMutation,
  useGetBannerCandidatesQuery,
} = contestApi;
