import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/store/baseQuery';
import { GetUsersResponse, User } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery(typeof window === 'undefined'),
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: GetUsersResponse }, { page?: number; limit?: number }>({
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
  }),
});

export const { useGetUsersQuery, useLazyGetUsersQuery, useGetUserQuery, useLazyGetUserQuery } =
  userApi;
