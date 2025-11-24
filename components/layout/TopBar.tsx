'use client';

import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import Notification from './Notification';
import useDashboard from '@/hooks/useDashboard';

const TopBar = () => {
  const { isSidebarVisible } = useDashboard();

  return (
    <header
      className={cn(
        'bg-background fixed top-0 right-0 left-0 z-50 flex h-[57px] items-center justify-between border-b p-4 px-4 transition-all duration-300 ease-in-out',
        isSidebarVisible ? 'pl-[260px]' : 'pl-20',
      )}
    >
      <p></p>
      <div className="flex items-center gap-5">
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
