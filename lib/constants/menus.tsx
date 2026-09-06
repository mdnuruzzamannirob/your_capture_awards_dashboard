import { SideMenu } from '@/types';
import { HiOutlineWallet } from 'react-icons/hi2';
import { IoSettingsOutline, IoStorefrontOutline } from 'react-icons/io5';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineContactSupport, MdOutlineMonochromePhotos } from 'react-icons/md';
import { TbFlag, TbRepeat, TbUsers } from 'react-icons/tb';

export const sideMenus: SideMenu[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LuLayoutDashboard className="size-full" />,
  },
  {
    name: 'Users',
    href: '/users',
    icon: <TbUsers className="size-full" />,
  },
  {
    name: 'Contest',
    href: '/contest',
    icon: <MdOutlineMonochromePhotos className="size-full" />,
  },
  {
    name: 'Recurring Contest',
    href: '/recurring-contest',
    icon: <TbRepeat className="size-full" />,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <TbFlag className="size-full" />,
  },
  {
    name: 'Store',
    href: '/store',
    icon: <IoStorefrontOutline className="size-full" />,
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: <HiOutlineWallet className="size-full" />,
  },
  {
    name: 'Support',
    href: '/support',
    icon: <MdOutlineContactSupport className="size-full" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <IoSettingsOutline className="size-full" />,
  },
];
