'use client';

import { makeStore } from '@/store/makeStore';
import { Provider as ReduxProvider } from 'react-redux';

const Provider = ({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: any;
}) => {
  const store = makeStore(preloadedState);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default Provider;
