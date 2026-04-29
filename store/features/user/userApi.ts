import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiSuccessResponse, GetUsersResponse, ToggleBlockBody, User } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiSuccessResponse<GetUsersResponse>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => `/users?page=${page}&limit=${limit}`,
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
        url: '/dashboard/toggole-block',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
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
