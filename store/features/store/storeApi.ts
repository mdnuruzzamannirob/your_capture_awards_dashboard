import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  CreateStoreProductBody,
  StoreProduct,
  StoreProductsListData,
  StoreProductType,
  StoreStats,
  UpdateStoreProductBody,
} from './types';

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery,
  tagTypes: ['StoreStats', 'StoreProducts'],
  endpoints: (builder) => ({
    getStoreStats: builder.query<ApiSuccessResponse<StoreStats>, void>({
      query: () => '/dashboard/store/stats',
      providesTags: [{ type: 'StoreStats', id: 'SINGLE' }],
    }),

    getStoreProducts: builder.query<
      ApiSuccessResponse<StoreProductsListData>,
      { type: StoreProductType; page?: number; limit?: number }
    >({
      query: ({ type, page = 1, limit = 10 }) => `/stores?type=${type}&page=${page}&limit=${limit}`,
      providesTags: [{ type: 'StoreProducts', id: 'LIST' }],
    }),

    createStoreProduct: builder.mutation<ApiSuccessResponse<StoreProduct>, CreateStoreProductBody>({
      query: (body) => ({
        url: '/stores',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'StoreProducts', id: 'LIST' },
        { type: 'StoreStats', id: 'SINGLE' },
      ],
    }),

    updateStoreProduct: builder.mutation<ApiSuccessResponse<StoreProduct>, UpdateStoreProductBody>({
      query: ({ productId, ...body }) => ({
        url: `/stores/${productId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'StoreProducts', id: 'LIST' },
        { type: 'StoreStats', id: 'SINGLE' },
      ],
    }),

    deleteStoreProduct: builder.mutation<ApiSuccessResponse<StoreProduct>, { productId: string }>({
      query: ({ productId }) => ({
        url: `/stores/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'StoreProducts', id: 'LIST' },
        { type: 'StoreStats', id: 'SINGLE' },
      ],
    }),
  }),
});

export const {
  useGetStoreStatsQuery,
  useGetStoreProductsQuery,
  useCreateStoreProductMutation,
  useUpdateStoreProductMutation,
  useDeleteStoreProductMutation,
} = storeApi;
