export type SocialPlatform =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'X'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'LINKEDIN'
  | 'PINTEREST'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'WEBSITE';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateSocialLinkBody {
  platform: SocialPlatform;
  url: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateSocialLinkBody {
  id: string;
  platform?: SocialPlatform;
  url?: string;
  order?: number;
  isActive?: boolean;
}
