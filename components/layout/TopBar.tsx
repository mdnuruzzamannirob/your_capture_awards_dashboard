'use client';

import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';
import Notification from './Notification';
import useDashboard from '@/hooks/useDashboard';
import Link from 'next/link';
import Image from 'next/image';

const TopBar = () => {
  const { isSidebarVisible } = useDashboard();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    window.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
  };

  return (
    <header
      className={cn(
        'bg-background fixed top-0 right-0 left-0 z-50 flex h-[57px] items-center justify-between border-b px-4 transition-all duration-300 ease-in-out',
        isMobile ? 'pl-4' : isSidebarVisible ? 'pl-[260px]' : 'pl-20',
      )}
    >
      {/* 1. Left Section: Hamburger Menu (Only on Mobile) */}
      <div className="flex flex-1 items-center lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex size-10 items-center justify-center rounded-md transition-colors hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* 2. Middle Section: Logo (Perfectly Centered on max-lg) */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center lg:hidden">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={142}
            height={54}
            className="h-[30px] w-auto object-contain"
          />
        </Link>
      </div>

      {/* 3. Placeholder for Desktop Left Spacing */}
      {!isMobile && <div className="hidden lg:block" />}

      {/* 4. Right Section: Notification & UserMenu */}
      <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
