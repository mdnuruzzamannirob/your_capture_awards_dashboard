'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import SideBar from './SideBar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-dvh">
      <TopBar isExpanded={isExpanded} />
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <main
        className={cn(
          'size-full pt-[73px] pr-4 pb-4 transition-all duration-300 ease-in-out',
          isExpanded ? 'pl-64' : 'pl-20',
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
