export type StoreProductType = 'KEY' | 'BOOST' | 'SWAP';
export type StoreProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export interface StoreStats {
  totalProducts: number;
  totalPurchases: number;
  totalRevenue: number;
  totalStoreValue: number;
  totalActiveProducts: number;
}

export interface StoreProduct {
  id: string;
  productType: StoreProductType;
  title: string;
  quantity: number;
  amount: number;
  currency: string;
  icon: string | null;
  description: string | null;
  image: string | null;
  status: StoreProductStatus;
}

export interface StoreListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StoreProductsListData {
  meta: StoreListMeta;
  data: StoreProduct[];
}

export interface CreateStoreProductBody {
  title: string;
  description: string;
  type: StoreProductType;
  quantity: number;
  amount: number;
  currency: string;
  status: StoreProductStatus;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
