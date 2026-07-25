'use client';

import { IoIosArrowForward } from 'react-icons/io';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { sideMenus } from '@/lib/constants/menus';

const SideBar = () => {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for mobile sidebar toggle
  useEffect(() => {
    const handleToggle = () => {
      setIsMobileOpen((prev) => !prev);
    };
    window.addEventListener('toggleMobileSidebar', handleToggle);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggle);
  }, []);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div className="bg-overlay fixed inset-0 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      <aside
        className={cn(
          'border-sidebar-border bg-sidebar fixed z-50 h-dvh overflow-hidden border-r',
          isMobile ? (isMobileOpen ? 'w-60' : 'w-0') : 'w-60',
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="border-border-subtle flex h-14 items-center justify-center border-b px-4 max-lg:justify-center"
        >
          <Image src="/images/logo.png" alt="Logo" width={142} height={54} className="h-8 w-auto" />
        </Link>

        {/* Menu */}
        <div className="flex flex-col gap-0.5 p-3">
          {sideMenus.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = openGroups[item.name];
            const isActive = pathname.startsWith(item.href);

            return (
              <div key={item.name} className="flex flex-col">
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={cn(
                      'relative flex h-8 min-w-8 items-center gap-2 rounded-sm px-2 text-left capitalize transition-colors duration-80',
                      isActive
                        ? 'bg-primary-soft text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
                    )}
                  >
                    <span
                      className={cn('size-4 min-w-4 transition-colors', isActive && 'text-primary')}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="flex-1 text-[13px] font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </span>
                    <IoIosArrowForward
                      className={cn(
                        'transition-all duration-300',
                        isOpen ? 'rotate-90' : 'rotate-0',
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'relative flex h-8 min-w-8 items-center gap-2 rounded-sm px-2 text-left capitalize transition-colors duration-80',
                      isActive
                        ? 'bg-primary-soft text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
                    )}
                  >
                    <span
                      className={cn('size-4 min-w-4 transition-colors', isActive && 'text-primary')}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="flex-1 text-[13px] font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </span>
                  </Link>
                )}

                {/* Nested children */}
                {hasChildren && isOpen && (
                  <div className="border-border-subtle mt-1 ml-4 flex flex-col gap-0.5 border-l pl-2">
                    {item.children!.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'rounded-sm px-2 py-1.5 text-xs transition-colors duration-80',
                            childActive
                              ? 'bg-primary-soft text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile close button */}
        {isMobile && isMobileOpen && (
          <button
            onClick={closeMobileMenu}
            className="group border-border-subtle bg-sidebar text-muted-foreground hover:bg-surface hover:text-foreground absolute right-0 bottom-0 left-0 flex items-center gap-1 border-t p-3 transition-colors duration-80"
          >
            <span className="flex size-8 min-w-8 items-center justify-center">
              <X className="size-4" />
            </span>
            <span className="overflow-hidden text-left text-xs font-medium whitespace-nowrap">
              Close Menu
            </span>
          </button>
        )}
      </aside>
    </>
  );
};

export default SideBar;
