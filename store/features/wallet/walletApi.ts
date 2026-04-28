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
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `/dashboard/transactions?page=${page}&limit=${limit}`,
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
