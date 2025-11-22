import DashboardLayout from '@/components/layout/DashboardLayout';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
