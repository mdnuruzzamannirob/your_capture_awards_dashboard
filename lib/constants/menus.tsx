import { SideMenu } from '@/types';
import { LuLayoutDashboard } from 'react-icons/lu';
import { TbReportMoney, TbUsers } from 'react-icons/tb';
import { MdOutlineContactSupport, MdOutlineMonochromePhotos } from 'react-icons/md';
import { HiOutlineWallet } from 'react-icons/hi2';
import { IoStorefrontOutline } from 'react-icons/io5';

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
    name: 'Store',
    href: '/store',
    icon: <IoStorefrontOutline className="size-full" />,
  },
  {
    name: 'Subscription Plan',
    href: '/subscription-plan',
    icon: <TbReportMoney className="size-full" />,
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: <HiOutlineWallet className="size-full" />,
  },
  {
    name: 'Contact Support',
    href: '/contact-support',
    icon: <MdOutlineContactSupport className="size-full" />,
  },
];
