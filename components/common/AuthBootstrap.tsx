'use client';

import Cookies from 'js-cookie';
import { useGetMeQuery } from '@/store/features/auth/authApi';
import { useAppSelector } from '@/store/hooks';

const AuthBootstrap = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hasToken = Boolean(Cookies.get('token'));

  useGetMeQuery(undefined, {
    skip: !hasToken || Boolean(user),
  });

  return null;
};

export default AuthBootstrap;
