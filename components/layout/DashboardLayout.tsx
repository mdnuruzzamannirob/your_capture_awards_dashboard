'use client';

import SideBar from './SideBar';
import TopBar from './TopBar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background min-h-dvh">
      <TopBar />
      <SideBar />
      <main className="size-full min-h-dvh pt-14 lg:block lg:pl-60">{children}</main>
    </div>
  );
};

export default DashboardLayout;
