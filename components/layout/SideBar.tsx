'use client';

import { IoIosArrowForward } from 'react-icons/io';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { sideMenus } from '@/lib/constants/menus';
import useDashboard from '@/hooks/useDashboard';

const SideBar = () => {
  const { setIsSidebarVisible } = useDashboard();
  const pathname = usePathname();

  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
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

  const realExpand = isMobile ? isMobileOpen : isPinned || isHovered;

  // Sync with parent layout
  useEffect(() => {
    setIsSidebarVisible(realExpand);
  }, [realExpand, setIsSidebarVisible]);

  // Logo smooth toggle
  const [showLogo, setShowLogo] = useState(realExpand);
  useEffect(() => {
    const timeout = setTimeout(() => setShowLogo(realExpand), realExpand ? 100 : 0);
    return () => clearTimeout(timeout);
  }, [realExpand]);

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
          'border-sidebar-border bg-sidebar fixed z-50 h-dvh overflow-hidden border-r transition-[width] duration-240 ease-[cubic-bezier(0.2,0,0,1)]',
          isMobile ? (isMobileOpen ? 'w-60' : 'w-0') : realExpand ? 'w-60' : 'w-16',
        )}
        onMouseEnter={() => !isPinned && !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isPinned && !isMobile && setIsHovered(false)}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="border-border-subtle flex h-14 items-center justify-center border-b px-4 max-lg:justify-center"
        >
          {showLogo ? (
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={142}
              height={54}
              className="h-8 w-auto"
            />
          ) : (
            <Image
              src="/icons/site-icon.png"
              alt="Icon"
              width={28}
              height={28}
              className="size-8 min-w-8"
            />
          )}
        </Link>

        {/* Menu */}
        <div className="flex flex-col gap-0.5 p-3">
          <div
            className={cn(
              'font-token text-caption-foreground mb-1 overflow-hidden px-2 py-1 text-[10px] font-medium tracking-[0.08em] whitespace-nowrap uppercase transition-opacity duration-150',
              realExpand ? 'opacity-100' : 'opacity-0',
            )}
          >
            Workspace
          </div>
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
                      'relative flex h-8 min-w-8 items-center gap-2 rounded-sm px-2 text-left capitalize transition-colors duration-[80ms]',
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
                      className={cn(
                        'flex-1 text-[13px] font-medium whitespace-nowrap transition-all duration-240',
                        realExpand ? 'w-full opacity-100' : 'w-0 opacity-0',
                      )}
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
                      'relative flex h-8 min-w-8 items-center gap-2 rounded-sm px-2 text-left capitalize transition-colors duration-[80ms]',
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
                      className={cn(
                        'flex-1 text-[13px] font-medium whitespace-nowrap transition-all duration-240',
                        realExpand ? 'w-full opacity-100' : 'w-0 opacity-0',
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                )}

                {/* Nested children */}
                {hasChildren && isOpen && realExpand && (
                  <div className="border-border-subtle mt-1 ml-4 flex flex-col gap-0.5 border-l pl-2">
                    {item.children!.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'rounded-sm px-2 py-1.5 text-xs transition-colors duration-[80ms]',
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

        {/* Pin/Collapse button - only on desktop */}
        {!isMobile && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="group border-border-subtle bg-sidebar text-muted-foreground hover:bg-surface hover:text-foreground absolute right-0 bottom-0 left-0 flex items-center gap-1 border-t p-3 transition-colors duration-[80ms]"
          >
            <span className="flex size-8 min-w-8 items-center justify-center">
              <TbLayoutSidebarLeftCollapse
                className={cn(
                  'size-4 transition-transform duration-240',
                  isPinned ? 'rotate-180' : 'rotate-0',
                )}
              />
            </span>
            <span
              className={cn(
                'overflow-hidden text-left text-xs font-medium whitespace-nowrap transition-all duration-240',
                realExpand ? 'w-32 opacity-100' : 'w-0 opacity-0',
              )}
            >
              {isPinned ? 'Hide Sidebar' : 'Show Sidebar'}
            </span>
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && isMobileOpen && (
          <button
            onClick={closeMobileMenu}
            className="group border-border-subtle bg-sidebar text-muted-foreground hover:bg-surface hover:text-foreground absolute right-0 bottom-0 left-0 flex items-center gap-1 border-t p-3 transition-colors duration-[80ms]"
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
