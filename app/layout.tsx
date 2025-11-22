import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import Provider from './providers';
import { authApi } from '@/store/features/auth/authApi';
import { makeStore } from '@/store/makeStore';

const kumbhSans = Kumbh_Sans({
  variable: '--font-kumbh-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Panel - Your Capture Awards',
  description: 'Admin Panel - Your Capture Awards',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = makeStore();

  await store.dispatch(authApi.endpoints.getMe.initiate());
  await Promise.all(store.dispatch(authApi.util.getRunningQueriesThunk()));

  const preloadedState = store.getState();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('antialiased', kumbhSans.className)} suppressHydrationWarning>
        <Provider preloadedState={preloadedState}>
          <Toaster closeButton richColors />
          {children}
        </Provider>
      </body>
    </html>
  );
}
