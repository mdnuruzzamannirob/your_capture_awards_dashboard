export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FaqsResponse {
  success: boolean;
  message: string;
  meta: FaqListMeta;
  data: Faq[];
}

export interface FaqResponse {
  success: boolean;
  message: string;
  data: Faq;
}

export interface FaqPayload {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}
