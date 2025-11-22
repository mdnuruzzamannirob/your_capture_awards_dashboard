import { SideMenu } from '@/types';
import { LuLayoutDashboard } from 'react-icons/lu';

export const sideMenus: SideMenu[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'User Management',
    href: '/user-management',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'Contest Management',
    href: '/contest-management',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'setting',
    href: '/setting',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'Support',
    href: '/support',
    icon: <LuLayoutDashboard className="size-full" />,
  },
];
