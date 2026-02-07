'use client';

import { Provider } from 'react-redux';
import AuthBootstrap from '@/components/common/AuthBootstrap';
import { store } from '@/store/store';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store()}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
