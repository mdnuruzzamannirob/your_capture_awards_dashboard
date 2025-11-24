'use client';

import { IoIosArrowForward } from 'react-icons/io';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sideMenus } from '@/constants/menus';
import useDashboard from '@/hooks/useDashboard';

const SideBar = () => {
  const { isSidebarVisible, setIsSidebarVisible } = useDashboard();
  const pathname = usePathname();

  const [isSidebarHovered, setSidebarHovered] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const realExpand = isPinned || isSidebarHovered;

  // Sync parent expansion state
  useEffect(() => {
    if (isSidebarVisible !== realExpand) setIsSidebarVisible(realExpand);
  }, [realExpand, isSidebarVisible, setIsSidebarVisible]);

  // Logo swap with delay
  const [showLogo, setShowLogo] = useState(realExpand);
  useEffect(() => {
    const timeout = setTimeout(() => setShowLogo(realExpand), realExpand ? 100 : 0);
    return () => clearTimeout(timeout);
  }, [realExpand]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={cn(
        'bg-background fixed z-50 h-dvh border-r transition-all duration-300',
        realExpand ? 'w-60' : 'w-16',
      )}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex h-[57px] items-center border-b px-4">
        {showLogo ? (
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={142}
            height={54}
            className="mt-1 ml-px h-[35.1px] w-auto"
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

      {/* Main menu */}
      <div className="flex flex-col gap-3 p-3">
        {sideMenus.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = openGroups[item.name];
          const isActive = pathname.startsWith(item.href);

          return (
            <div key={item.name} className="flex flex-col">
              {/* Parent Item */}
              {hasChildren ? (
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    'flex h-10 min-w-10 items-center gap-3 rounded-sm p-2 text-left capitalize',
                    isActive
                      ? 'bg-gray-800 font-medium'
                      : 'text-muted-foreground hover:bg-gray-800',
                  )}
                >
                  <span className="size-6 min-w-6 transition-all duration-300">{item.icon}</span>
                  <span
                    className={cn(
                      'flex-1 text-sm font-medium whitespace-nowrap transition-all duration-300',
                      realExpand ? 'w-full opacity-100' : 'w-0 opacity-0',
                    )}
                  >
                    {item.name}
                  </span>

                  <IoIosArrowForward
                    className={cn('transition-all duration-300', isOpen ? 'rotate-90' : 'rotate-0')}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-10 min-w-10 items-center gap-3 rounded-sm p-2 text-left capitalize',
                    isActive
                      ? 'bg-gray-800 font-medium'
                      : 'text-muted-foreground hover:bg-gray-800',
                  )}
                >
                  <span className="size-6 min-w-6 transition-all duration-300">{item.icon}</span>
                  <span
                    className={cn(
                      'flex-1 text-sm font-medium whitespace-nowrap transition-all duration-300',
                      realExpand ? 'w-full opacity-100' : 'w-0 opacity-0',
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              )}

              {/* Nested Children */}
              {hasChildren && isOpen && realExpand && (
                <div className="mt-1 ml-5 flex flex-col gap-1">
                  {item.children!.map((child) => {
                    const childActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm',
                          childActive
                            ? 'bg-gray-800 font-medium'
                            : 'text-muted-foreground hover:bg-gray-800',
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

      {/* Pin/Collapse button */}
      <button
        onClick={() => setIsPinned(!isPinned)}
        className="group absolute right-0 bottom-0 left-0 flex items-center gap-1 bg-gray-900 p-3 transition-all duration-300"
      >
        <span className="flex size-10 min-w-10 items-center justify-center">
          <TbLayoutSidebarLeftCollapse
            className={cn(
              'size-6 transition-transform duration-300',
              isPinned ? 'rotate-180' : 'rotate-0',
            )}
          />
        </span>
        <span
          className={cn(
            'text-muted-foreground overflow-hidden text-left text-sm font-medium whitespace-nowrap transition-all duration-300 group-hover:text-inherit',
            realExpand ? 'w-32 opacity-100' : 'w-0 opacity-0',
          )}
        >
          {isPinned ? 'Hide Sidebar' : 'Show Sidebar'}
        </span>
      </button>
    </aside>
  );
};

export default SideBar;
