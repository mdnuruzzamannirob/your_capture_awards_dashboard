export type StoreProductCategory = 'COINS' | 'BUNDLES';
export type StoreBundleItemType = 'KEY' | 'BOOST' | 'SWAP';
export type StoreProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export interface StoreStats {
  totalProducts: number;
  totalPurchases: number;
  totalRevenue: number;
  totalStoreValue: number;
  totalActiveProducts: number;
}

export interface StoreBundleItem {
  type: StoreBundleItemType;
  quantity: number;
}

export interface StoreProduct {
  id: string;
  category: StoreProductCategory;
  title: string;
  quantity: number;
  amount: number;
  currency: string;
  icon: string | null;
  description: string | null;
  image: string | null;
  status: StoreProductStatus;
  items: StoreBundleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StoreProductFormItem {
  type: StoreBundleItemType;
  quantity: number;
}

export interface CreateStoreProductBody {
  title: string;
  description: string;
  category: StoreProductCategory;
  quantity: number;
  amount: number;
  currency: string;
  status: StoreProductStatus;
  image?: File | string | null;
  items: StoreProductFormItem[];
}

export interface UpdateStoreProductBody extends CreateStoreProductBody {
  productId: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StoreProductsResponse {
  success: boolean;
  message: string;
  meta: StoreListMeta;
  data: StoreProduct[];
}
