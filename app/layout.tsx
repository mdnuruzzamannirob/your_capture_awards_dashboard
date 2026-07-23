import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Kumbh_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import ReduxProvider from '../providers/ReduxProviders';

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
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('antialiased', kumbhSans.className)} suppressHydrationWarning>
        <ReduxProvider>
          <TooltipProvider>
            <Toaster
              duration={3000}
              position="top-center"
              theme="dark"
              swipeDirections={['bottom', 'left', 'top', 'right']}
              richColors
              expand
            />
            {children}
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
