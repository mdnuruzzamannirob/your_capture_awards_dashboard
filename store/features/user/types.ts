export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string;
  role: string;
  status?: string;
  avatar: string;
  cover: string;
  isActive: boolean;
  currentLevel: number;
  voting_power: number;
  purchased_plan?: any;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
