'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Notification from './Notification';
import UserMenu from './UserMenu';

const TopBar = () => {
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
      className="border-border-subtle bg-surface fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b px-4 lg:pl-65"
    >
      {/* 1. Left Section: Hamburger Menu (Only on Mobile) */}
      <div className="flex flex-1 items-center lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-sm transition-colors duration-80 focus-visible:shadow-(--focus-shadow)"
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
            className="h-7.5 w-auto object-contain"
          />
        </Link>
      </div>

      {/* 3. Right Section: Notification, user avatar, and logout */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <Notification />
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
