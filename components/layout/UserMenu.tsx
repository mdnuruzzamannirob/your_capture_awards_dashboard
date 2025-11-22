'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { LogOut, User as ProfileUser } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useAppDispatch } from '@/store/hooks';
import { removeUser } from '@/store/features/auth/authSlice';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { DialogTrigger } from '@radix-ui/react-dialog';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, token } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    router.push('/signin');
    dispatch(removeUser());
    Cookies.remove('token');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {user?.avatar ? (
          <Image
            alt="User Avatar"
            src={user?.avatar}
            width={32}
            height={32}
            className="size-8 cursor-pointer overflow-hidden rounded-full object-cover"
          />
        ) : (
          <button
            className={cn(
              'hidden size-8 overflow-hidden rounded-full border text-xs leading-none font-medium lg:block',
              !user || !token ? 'hidden' : 'lg:block',
            )}
          >
            {user?.firstName?.charAt(0) || 'U'}
            {user?.lastName?.charAt(0) || null}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="text-foreground w-full max-w-72 rounded-md border border-gray-800 bg-gray-900 p-0 sm:max-w-72"
      >
        <div className="flex items-center gap-3 p-3">
          {user?.avatar ? (
            <Image
              alt="User Avatar"
              src={user?.avatar}
              width={32}
              height={32}
              className="size-8 min-w-8 cursor-pointer overflow-hidden rounded-full object-cover"
            />
          ) : (
            <button
              className={cn(
                'hidden size-8 overflow-hidden rounded-full border text-xs leading-none font-medium lg:block',
                !user || !token ? 'hidden' : 'lg:block',
              )}
            >
              {user?.firstName?.charAt(0) || 'U'}
              {user?.lastName?.charAt(0) || null}
            </button>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-black-2-300 truncate text-xs">{user?.email}</span>
          </div>
        </div>
        <div className="border-t border-gray-800"></div>
        <div className="flex flex-col gap-1 p-1">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-gray-20 flex h-10 items-center gap-2 rounded-sm p-2 text-sm',
              pathname === '/profile'
                ? 'bg-gray-800 font-medium'
                : 'text-muted-foreground hover:bg-gray-800',
            )}
          >
            <ProfileUser className="size-4" />
            Profile
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-gray-20 flex h-10 items-center gap-2 rounded-sm p-2 text-sm',
              pathname === '/settings'
                ? 'bg-gray-800 font-medium'
                : 'text-muted-foreground hover:bg-gray-800',
            )}
          >
            <ProfileUser className="size-4" />
            Settings
          </Link>
        </div>
        <div className="border-t border-gray-800"></div>
        <div className="flex flex-col p-1">
          <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleLogout}
                className={cn(
                  'text-destructive hover:bg-destructive/10 flex h-10 items-center gap-2 rounded-sm px-2 text-sm outline-none',
                )}
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-xl border-gray-700 bg-gray-900">
              <DialogTitle />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="bg-destructive/10 text-destructive rounded-full p-5">
                  <LogOut />
                </div>

                <h1 className="text-2xl font-semibold">Logout</h1>
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="my-5 flex items-center justify-center gap-5">
                <Button
                  variant="ghost"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-sm"
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout} className="rounded-sm">
                  Yes, Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
