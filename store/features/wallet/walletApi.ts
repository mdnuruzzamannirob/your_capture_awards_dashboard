import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  PaymentsListResponse,
  TransactionsListData,
  WalletTransactionStats,
} from './types';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery,
  tagTypes: ['TransactionStats', 'Transactions', 'Payments'],
  endpoints: (builder) => ({
    getTransactionStats: builder.query<ApiSuccessResponse<WalletTransactionStats>, void>({
      query: () => '/dashboard/transactions/stats',
      providesTags: [{ type: 'TransactionStats', id: 'SINGLE' }],
    }),

    getTransactions: builder.query<
      ApiSuccessResponse<TransactionsListData>,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search?.trim()) params.set('search', search.trim());
        return `/dashboard/transactions?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        success: response.success,
        message: response.message,
        data: {
          payments: Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.payments)
              ? response.data.payments
              : [],
          total: response.data?.total ?? response.meta?.total ?? 0,
          page: response.data?.page ?? response.meta?.page ?? 1,
          limit: response.data?.limit ?? response.meta?.limit ?? 10,
        },
      }),
      providesTags: [{ type: 'Transactions', id: 'LIST' }],
    }),

    getPayments: builder.query<PaymentsListResponse, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;
        return `/dashboard/payments?page=${page}&limit=${limit}`;
      },
      providesTags: [{ type: 'Payments', id: 'LIST' }],
    }),
  }),
});

export const { useGetTransactionStatsQuery, useGetTransactionsQuery, useGetPaymentsQuery } =
  walletApi;
