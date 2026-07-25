import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import ReduxProvider from '../providers/ReduxProviders';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
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
      <body
        className={cn('antialiased', inter.variable, jetBrainsMono.variable)}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <TooltipProvider>
            <Toaster
              duration={3000}
              position="top-center"
              theme="dark"
              swipeDirections={['bottom', 'left', 'top', 'right']}
              expand
              toastOptions={{
                classNames: {
                  toast:
                    'border-border-default! bg-elevated! text-foreground! rounded-lg! shadow-[var(--shadow-lg)]!',
                  title: 'text-[13px]! font-medium!',
                  description: 'text-xs! text-muted-foreground!',
                  actionButton: 'bg-primary! text-primary-foreground! rounded-md!',
                  cancelButton: 'bg-surface-tertiary! text-foreground! rounded-md!',
                  closeButton: 'border-border-default! bg-surface-tertiary! text-muted-foreground!',
                },
              }}
            />
            {children}
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
