export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName?: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  role: string;
  status?: string;
  avatar: string;
  cover: string;
  location?: string | null;
  country?: string | null;
  isActive: boolean;
  is_blocked?: boolean;
  currentLevel: number;
  voting_power: number;
  purchased_plan?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ToggleBlockBody {
  userId: string;
}

export interface UpdateProfileBody {
  userId: string;
  firstName: string;
  lastName: string;
  location: string;
}

export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}
