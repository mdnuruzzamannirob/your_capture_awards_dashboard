import { decodeToken } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? null;

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (role === 'ADMIN') {
    redirect('/dashboard');
  }

  return <main>{children}</main>;
};

export default AuthLayout;
