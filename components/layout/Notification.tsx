'use client';

import { cn } from '@/lib/utils';
import {
  useGetAdminNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '@/store/features/notification/notificationApi';
import { NotificationItem, NotificationType } from '@/store/features/notification/types';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RiNotification3Line } from 'react-icons/ri';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const typeLabel: Record<NotificationType, string> = {
  [NotificationType.DEFAULT]: 'Update',
  [NotificationType.INVITATION]: 'Invitation',
  [NotificationType.PAYMENT]: 'Payment',
  [NotificationType.VOTE]: 'Vote',
  [NotificationType.LIKE]: 'Like',
  [NotificationType.TEAM_JOIN_REQUEST]: 'Team request',
  [NotificationType.TEAM_JOIN_APPROVED]: 'Team approved',
  [NotificationType.TEAM_JOIN_REJECTED]: 'Team rejected',
};

const formatRelative = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

const Notification = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetAdminNotificationsQuery({ page: 1, limit: 10 });
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data.notifications ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    try {
      await markAllRead().unwrap();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  const renderNotification = (notification: NotificationItem) => (
    <div
      key={notification.id}
      className={cn(
        'relative flex items-start gap-2.5 rounded-lg border p-3 transition-colors duration-150',
        notification.isRead
          ? 'border-border-subtle bg-surface-secondary'
          : 'bg-primary-soft border-transparent',
      )}
    >
      <div
        className={cn(
          'border-border-subtle flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium',
          notification.isRead
            ? 'bg-surface-tertiary text-muted-foreground'
            : 'bg-primary-soft text-primary',
        )}
      >
        {typeLabel[notification.type].slice(0, 1)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium">{notification.title}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{notification.message}</p>
          </div>
          {!notification.isRead && (
            <span className="bg-primary mt-1 size-2 shrink-0 rounded-full" />
          )}
        </div>
        <div className="text-muted-foreground mt-2 flex items-center justify-between text-[11px]">
          <span>{typeLabel[notification.type]}</span>
          <span>{formatRelative(notification.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="group border-border-default bg-surface-secondary text-muted-foreground hover:border-border-strong hover:bg-surface-tertiary hover:text-foreground inline-flex size-8 items-center justify-center rounded-sm border transition-colors duration-[80ms] focus-visible:shadow-[var(--focus-shadow)]"
        >
          <span className="relative flex items-center justify-center">
            <RiNotification3Line className="group-hover:text-foreground size-4 transition-colors" />
            {unreadCount > 0 && (
              <span className="bg-primary ring-background absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full ring-2" />
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-96 p-0">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <p className="text-[13px] font-semibold">Notifications</p>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || isMarking}
            className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IoCheckmarkDone className="size-4" />
            Mark all read
          </button>
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground p-4 text-center text-sm">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No notifications found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
