'use client';

import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import SideBar from './SideBar';
import useDashboard from '@/hooks/useDashboard';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarVisible } = useDashboard();

  return (
    <div className="min-h-dvh">
      <TopBar />
      <SideBar />
      <main
        className={cn(
          'size-full pt-[57px] pb-5 transition-all duration-300 ease-in-out',
          isSidebarVisible ? 'pl-60' : 'pl-16',
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
