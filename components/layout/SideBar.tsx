'use client';

import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SideLinkGroup, SideLinkItem } from '@/app/(dashboard)/layout';

interface SidebarProps {
  sideLinks: SideLinkGroup[];
  isExpanded: boolean; // Controlled from parent
  setIsExpanded: (value: boolean) => void;
}

const SideBar = ({ sideLinks, isExpanded, setIsExpanded }: SidebarProps) => {
  const pathname = usePathname();

  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  const realExpand = isPinned || isSidebarHovered;

  // Sync parent expansion state
  useEffect(() => {
    if (isExpanded !== realExpand) setIsExpanded(realExpand);
  }, [realExpand, isExpanded, setIsExpanded]);

  // Logo swap with delay
  const [showLogo, setShowLogo] = useState(realExpand);
  useEffect(() => {
    const timeout = setTimeout(() => setShowLogo(realExpand), realExpand ? 100 : 0);
    return () => clearTimeout(timeout);
  }, [realExpand]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Render main menu and its nested submenu
  const renderMainMenu = (items: SideLinkItem[]) =>
    items.map((link) => {
      const hasChildren = !!link.children?.length;
      const isActive = pathname.includes(link.href);
      const isOpen = openGroups[link.name];

      return (
        <div key={link.name} className="relative flex flex-col gap-1">
          <button
            onClick={() => hasChildren && toggleGroup(link.name)}
            onMouseEnter={() => !realExpand && setHoveredParent(link.name)}
            onMouseLeave={() => !realExpand && setHoveredParent(null)}
            className={cn(
              'flex items-center gap-2 rounded-sm border border-transparent transition-all',
              realExpand ? `h-10 px-3` : 'h-10 w-10 justify-center',
              isActive || isOpen
                ? 'border-neutral-200 bg-white text-neutral-800'
                : 'text-neutral-400 hover:bg-black/5 hover:text-neutral-800',
            )}
          >
            <span className="size-5">{link.icon}</span>
            {realExpand && <span className="flex-1 text-sm font-medium">{link.name}</span>}
            {hasChildren && realExpand && (
              <span className="ml-auto">
                {isOpen ? (
                  <IoIosArrowDown className="size-4" />
                ) : (
                  <IoIosArrowForward className="size-4" />
                )}
              </span>
            )}
          </button>

          {/* Nested submenu */}
          {hasChildren && isOpen && realExpand && (
            <div className="flex flex-col gap-1 pl-5">
              {link.children!.map((nested) => (
                <Link
                  key={nested.name}
                  href={nested.href}
                  className={cn(
                    'flex h-8 items-center rounded-sm px-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800',
                    pathname.includes(nested.href) && 'bg-gray-100 font-medium text-gray-800',
                  )}
                >
                  {nested.icon && <span className="mr-2">{nested.icon}</span>}
                  {nested.name}
                </Link>
              ))}
            </div>
          )}

          {/* Collapsed hover popover */}
          {!realExpand && hoveredParent === link.name && hasChildren && (
            <div className="absolute top-0 left-full z-20 w-48 rounded-xl border bg-white p-3 shadow-lg">
              <p className="mb-2 text-xs font-semibold text-slate-500">{link.name}</p>
              <div className="flex flex-col gap-1">
                {link.children!.map((nested) => (
                  <Link
                    key={nested.name}
                    href={nested.href}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100',
                      pathname.includes(nested.href) && 'bg-slate-100 font-medium text-slate-800',
                    )}
                  >
                    {nested.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    });

  return (
    <aside
      className={cn(
        'fixed z-10 h-dvh border-r bg-gray-950 transition-all duration-300',
        realExpand ? 'w-72' : 'w-16',
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
            className="mt-1 ml-[1.45px] h-[54px] w-auto"
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
      <div className="flex flex-col gap-4 p-4">
        {sideLinks.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            {renderMainMenu(group.items)}
          </div>
        ))}
      </div>

      {/* Pin/Collapse button */}
      <button
        onClick={() => setIsPinned(!isPinned)}
        className="group absolute right-0 bottom-0 left-0 flex items-center gap-3 bg-gray-900 p-3 transition-all duration-300"
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
            'overflow-hidden text-left text-sm font-medium whitespace-nowrap text-gray-400 transition-all duration-300 group-hover:text-inherit',
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
