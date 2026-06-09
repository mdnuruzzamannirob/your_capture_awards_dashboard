import { baseQuery } from '@/store/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ApiSuccessResponse,
  CreateStoreProductBody,
  StoreProduct,
  StoreStats,
  StoreProductsResponse,
  UpdateStoreProductBody,
} from './types';

const toFormData = (body: CreateStoreProductBody) => {
  const formData = new FormData();

  formData.append('title', body.title);
  formData.append('category', body.category);
  formData.append('quantity', String(body.quantity));
  formData.append('amount', String(body.amount));
  formData.append('currency', body.currency);
  formData.append('status', body.status);
  formData.append('description', body.description ?? '');

  if (body.image instanceof File) {
    formData.append('image', body.image);
  }

  body.items.forEach((item, index) => {
    formData.append(`items[${index}][type]`, item.type);
    formData.append(`items[${index}][quantity]`, String(item.quantity));
  });

  return formData;
};

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
      StoreProductsResponse,
      { category?: 'COINS' | 'BUNDLES'; page?: number; limit?: number }
    >({
      query: ({ category, page = 1, limit = 10 }) => ({
        url: `/stores?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'StoreProducts', id: 'LIST' }],
    }),

    createStoreProduct: builder.mutation<ApiSuccessResponse<StoreProduct>, CreateStoreProductBody>({
      query: (body) => ({
        url: '/stores',
        method: 'POST',
        body: toFormData(body),
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
        body: toFormData(body),
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
