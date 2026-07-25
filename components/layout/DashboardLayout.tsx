'use client';

import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import SideBar from './SideBar';
import useDashboard from '@/hooks/useDashboard';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarVisible } = useDashboard();

  return (
    <div className="bg-background min-h-dvh">
      <TopBar />
      <SideBar />
      <main
        className={cn(
          'size-full min-h-dvh pt-14 transition-[padding] duration-240 ease-[cubic-bezier(0.2,0,0,1)]',
          'lg:block lg:pl-60',
          !isSidebarVisible && 'lg:pl-16',
        )}
      >
        <div className="dashboard-page">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
