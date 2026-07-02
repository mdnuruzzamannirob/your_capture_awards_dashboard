import { baseQuery } from '@/store/baseQuery';
import { dashboardApi } from '@/store/features/dashboard/dashboardApi';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, GetUsersResponse, ToggleBlockBody, User } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Users', 'User', 'DashboardUserStats'],
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiSuccessResponse<GetUsersResponse>,
      { page?: number; limit?: number; search?: string; role?: string }
    >({
      query: ({ page = 1, limit = 20, search, role }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });

        if (search?.trim()) params.set('search', search.trim());
        if (role && role.toLowerCase() !== 'all') params.set('role', role.toUpperCase());

        return `/users?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        // Transform the API response to match GetUsersResponse structure
        return {
          ...response,
          data: {
            users: response.data,
            total: response.meta?.total || 0,
            page: response.meta?.page || 1,
            limit: response.meta?.limit || 20,
            totalPage: response.meta?.totalPage,
            hasNextPage: response.meta?.hasNextPage,
            hasPreviousPage: response.meta?.hasPreviousPage,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data?.users?.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    getUser: builder.query<User, { id: string }>({
      query: ({ id }) => `/users/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    toggleUserBlock: builder.mutation<ApiSuccessResponse<User>, ToggleBlockBody>({
      query: (body) => ({
        url: '/dashboard/toggle-block',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
        // Ensure dashboard user stats are invalidated so counts refresh
        { type: 'DashboardUserStats', id: 'SINGLE' },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Explicitly invalidate dashboard stats from the dashboardApi instance
          dispatch(
            dashboardApi.util.invalidateTags([{ type: 'DashboardUserStats', id: 'SINGLE' }]),
          );
        } catch {
          // ignore
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useToggleUserBlockMutation,
} = userApi;
