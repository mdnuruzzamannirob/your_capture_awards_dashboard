'use client';

import { useAppSelector } from '@/store/hooks';
import Cookies from 'js-cookie';

const useAuth = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const token = Cookies.get('token') ?? null;

  return { user, token, isAuthenticated };
};

export default useAuth;
