import DashboardLayout from '@/components/layout/DashboardLayout';
import { decodeToken } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/signin');
  }

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (!decoded) {
    redirect('/signin');
  }

  if (role !== 'ADMIN') {
    redirect('/signin');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
