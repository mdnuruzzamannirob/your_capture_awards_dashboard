'use client';

import useDashboard from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Notification from './Notification';
import UserMenu from './UserMenu';
import { sideMenus } from '@/lib/constants/menus';

const TopBar = () => {
  const { isSidebarVisible } = useDashboard();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const currentSection =
    sideMenus.find((item) => pathname.startsWith(item.href))?.name ??
    (pathname.startsWith('/settings') ? 'Settings' : 'Administration');

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
        'border-border-subtle bg-surface fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b px-4 transition-[padding] duration-240 ease-[cubic-bezier(0.2,0,0,1)]',
        isMobile ? 'pl-4' : isSidebarVisible ? 'pl-[260px]' : 'pl-20',
      )}
    >
      {/* 1. Left Section: Hamburger Menu (Only on Mobile) */}
      <div className="flex flex-1 items-center lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-muted-foreground hover:bg-surface-tertiary hover:text-foreground flex size-8 items-center justify-center rounded-sm transition-colors duration-[80ms] focus-visible:shadow-[var(--focus-shadow)]"
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

      {/* 3. Current workspace context */}
      {!isMobile && (
        <div className="hidden items-center gap-2 lg:flex">
          <span className="font-token text-caption-foreground text-[10px] tracking-[0.08em] uppercase">
            Workspace
          </span>
          <span className="bg-border-default h-3 w-px" />
          <span className="text-foreground text-[13px] font-medium">{currentSection}</span>
        </div>
      )}

      {/* 4. Right Section: Notification & UserMenu */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
