'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';
import AuthBootstrap from '@/components/common/AuthBootstrap';
import { store } from '@/store/store';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof store> | null>(null);
  if (!storeRef.current) storeRef.current = store();

  return (
    <Provider store={storeRef.current}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
};

export default ReduxProvider;

