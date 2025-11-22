'use client';

import { useAppSelector } from '@/store/hooks';
import Cookies from 'js-cookie';

const useAuth = () => {
  const { isAuthenticated, user, tempEmail, tempToken } = useAppSelector((state) => state.auth);
  const token = Cookies.get('token') ?? null;

  return { user, token, isAuthenticated, tempEmail, tempToken };
};

export default useAuth;
