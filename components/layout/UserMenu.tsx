'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { removeUser } from '@/store/features/auth/authSlice';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

const UserMenu = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    router.push('/signin');
    dispatch(removeUser());
    Cookies.remove('token');
  };

  if (!isMounted) {
    return;
  }

  const initials = `${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || ''}`;

  return (
    <>
      <div
        role="img"
        className="border-border-default bg-surface-secondary text-muted-foreground flex size-8 items-center justify-center rounded-md border"
        aria-label="Current user"
      >
        {user?.avatar ? (
          <Image
            alt="User Avatar"
            src={user.avatar}
            width={32}
            height={32}
            className="size-full rounded-md object-cover"
          />
        ) : (
          <span className="text-[10px] leading-none font-medium">{initials}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowLogoutConfirm(true)}
        className="border-border-default bg-surface-secondary text-muted-foreground hover:border-border-strong hover:text-destructive flex size-8 items-center justify-center rounded-md border transition-colors duration-[80ms] focus-visible:shadow-[var(--focus-shadow)]"
        aria-label="Logout"
      >
        <LogOut className="size-4" />
      </button>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
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
    </>
  );
};

export default UserMenu;
