'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LogOut, User as ProfileUser, Key, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  const [isMounted, setIsMounted] = useState(false);

  const { user, token } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    router.push('/signin');
    dispatch(removeUser());
    Cookies.remove('token');
    setOpen(false);
  };

  if (!isMounted) {
    return;
  }

  const tab = searchParams.get('tab');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {user?.avatar ? (
          <Image
            alt="User Avatar"
            src={user?.avatar}
            width={28}
            height={28}
            className="border-border-subtle size-7 cursor-pointer overflow-hidden rounded-full border object-cover"
          />
        ) : (
          <button
            className={cn(
              'border-border-default bg-surface-tertiary text-muted-foreground hover:border-border-strong hover:text-foreground hidden size-7 overflow-hidden rounded-full border text-[10px] leading-none font-medium transition-colors focus-visible:shadow-[var(--focus-shadow)] lg:block',
              !user || !token ? 'hidden' : 'lg:block',
            )}
          >
            {user?.firstName?.charAt(0) || 'U'}
            {user?.lastName?.charAt(0) || null}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full max-w-72 rounded-md p-0 sm:max-w-72">
        <div className="flex items-center gap-3 p-3">
          {user?.avatar ? (
            <Image
              alt="User Avatar"
              src={user?.avatar}
              width={28}
              height={28}
              className="border-border-subtle size-7 min-w-7 cursor-pointer overflow-hidden rounded-full border object-cover"
            />
          ) : (
            <button
              className={cn(
                'border-border-default bg-surface-tertiary text-muted-foreground hidden size-7 overflow-hidden rounded-full border text-[10px] leading-none font-medium lg:block',
                !user || !token ? 'hidden' : 'lg:block',
              )}
            >
              {user?.firstName?.charAt(0) || 'U'}
              {user?.lastName?.charAt(0) || null}
            </button>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
          </div>
        </div>
        <div className="border-border border-t"></div>
        <div className="flex flex-col gap-1 p-1">
          <Link
            href="/settings?tab=profile"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-surface-tertiary flex h-8 items-center gap-2 rounded-sm px-2 text-[13px] transition-colors duration-[80ms]',
              pathname === '/settings' && (!tab || tab === 'profile')
                ? 'bg-surface-tertiary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <ProfileUser className="size-4" />
            Profile
          </Link>
          <Link
            href="/settings?tab=change-password"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-surface-tertiary flex h-8 items-center gap-2 rounded-sm px-2 text-[13px] transition-colors duration-[80ms]',
              pathname === '/settings' && tab === 'change-password'
                ? 'bg-surface-tertiary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Key className="size-4" />
            Change Password
          </Link>
          <Link
            href="/settings?tab=site-policy"
            onClick={() => setOpen(false)}
            className={cn(
              'hover:bg-surface-tertiary flex h-8 items-center gap-2 rounded-sm px-2 text-[13px] transition-colors duration-[80ms]',
              pathname === '/settings' && tab === 'site-policy'
                ? 'bg-surface-tertiary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <FileText className="size-4" />
            Site Policy
          </Link>
        </div>
        <div className="border-border border-t"></div>
        <div className="flex flex-col p-1">
          <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <DialogTrigger asChild>
              <button
                className={cn(
                  'text-destructive hover:bg-error-subtle flex h-8 items-center gap-2 rounded-sm px-2 text-[13px] transition-colors duration-[80ms] outline-none',
                )}
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="bg-error-subtle text-destructive flex size-10 items-center justify-center rounded-full">
                  <LogOut className="size-4" />
                </div>

                <h1 className="text-[15px] font-semibold">Sign out?</h1>
                <p className="text-muted-foreground text-[13px]">
                  You&apos;ll need to sign in again to access the dashboard.
                </p>
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
                  Sign out
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
